import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../UI/Button';
import signalRService from '../../services/signalRService';
import { accessEventAPI } from "../../services/api.js";
import { PersianPlate } from "../../utils/plateConverter.jsx";

const RealTimeAccessHandler = ({ onAccessProcessed }) => {
    const { t } = useTranslation();
    const [pendingEvents, setPendingEvents] = useState([]);
    const [processing, setProcessing] = useState(false);
    const processedEventIds = useRef(new Set());

    useEffect(() => {
        signalRService.startConnection();

        signalRService.setOnNewAccessEvent((newEvent) => {
            if (!processedEventIds.current.has(newEvent.id)) {
                processedEventIds.current.add(newEvent.id);
                setPendingEvents(prev => {
                    const exists = prev.some(event => event.id === newEvent.id);
                    if (!exists) {
                        return [newEvent, ...prev];
                    }
                    return prev;
                });
            }
        });

        return () => {
            signalRService.stopConnection();
            processedEventIds.current.clear();
        };
    }, []);

    const handleDelete = async (eventId) => {
        try {
            setProcessing(true);
            await accessEventAPI.delete(eventId);
            setPendingEvents(prev => prev.filter(e => e.id !== eventId));
            processedEventIds.current.delete(eventId);
            console.log(`${t('realtime.event_deleted')} ${eventId}`);
        } catch (error) {
            console.error('Error deleting event:', error);
            alert(`${t('realtime.delete_error')}: ${error.message}`);
        } finally {
            setProcessing(false);
        }
    };

    const handleProcessEvent = async (eventId, formData) => {
        if (!formData.accessType) {
            alert(t('realtime.select_access_type'));
            return;
        }

        setProcessing(true);
        try {
            const originalEvent = pendingEvents.find(e => e.id === eventId);

            if (!originalEvent) {
                throw new Error(t('realtime.event_not_found'));
            }

            const updateData = {
                vehicleName: formData.vehicleName || '',
                ownerFirstName: formData.ownerFirstName || '',
                ownerSurname: formData.ownerSurname || '',
                enter: formData.accessType === t('realtime.entry'),
                notes: '',
                isImportant: formData.isImportant || false
            };

            const response = await accessEventAPI.update(eventId, updateData);

            if (response) {
                const updatedEvent = {
                    id: eventId,
                    ...updateData,
                    processed: true
                };

                setPendingEvents(prev => prev.filter(e => e.id !== eventId));
                processedEventIds.current.delete(eventId);

                if (onAccessProcessed) {
                    onAccessProcessed({
                        ...originalEvent,
                        ...updatedEvent
                    });
                }
            }
        } catch (error) {
            console.error('Error processing event:', error);
            alert(`${t('realtime.process_error')}: ${error.message}`);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between p-2 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-primary">{t('realtime.active_realtime')}</span>
                </div>
                <div className="text-xs text-secondary">
                    {t('realtime.pending_count', { count: pendingEvents.length })}
                </div>
            </div>

            {/* Pending Events List */}
            {pendingEvents.map((event) => (
                <PendingEventRow
                    key={event.id}
                    event={event}
                    onProcess={handleProcessEvent}
                    processing={processing}
                    onDelete={() => handleDelete(event.id)}
                />
            ))}

            {/* Empty State */}
            {pendingEvents.length === 0 && (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{t('realtime.no_new_events')}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const PendingEventRow = ({ event, onProcess, processing, onDelete }) => {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        accessType: t('realtime.entry'),
        ownerFirstName: event.ownerFirstName || '',
        ownerSurname: event.ownerSurname || '',
        vehicleName: event.vehicleName || '',
        isImportant: false
    });

    const handleDeleteClick = () => {
        onDelete();
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAccessTypeChange = (accessType) => {
        setFormData(prev => ({
            ...prev,
            accessType
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.accessType) {
            alert(t('realtime.select_access_type'));
            return;
        }

        if (!formData.ownerFirstName.trim() || !formData.ownerSurname.trim()) {
            alert(t('realtime.enter_full_name'));
            return;
        }

        onProcess(event.id, formData);
    };

    const RadioButtonGroup = ({ value, onChange, options }) => (
        <div className="flex gap-4 bg-gray-100 p-1 rounded-lg">
            {options.map((option) => (
                <label
                    key={option.value}
                    className={`flex items-center gap-2 cursor-pointer px-3 py-1 rounded-md transition-all duration-200 ${
                        value === option.value
                            ? 'bg-white shadow-sm border border-primary/20'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    <input
                        type="radio"
                        name="accessType"
                        value={option.value}
                        checked={value === option.value}
                        onChange={() => onChange(option.value)}
                        className="hidden"
                    />
                    <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                        value === option.value
                            ? 'border-primary bg-primary'
                            : 'border-gray-400 bg-white'
                    }`}>
                        {value === option.value && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        )}
                    </div>
                    <span className={`text-sm font-medium ${
                        value === option.value ? 'text-primary' : 'text-gray-600'
                    }`}>
                        {option.label}
                    </span>
                </label>
            ))}
        </div>
    );

    const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div className="text-sm font-bold text-primary bg-gray-100 px-2 py-1 rounded">
                        <PersianPlate plate={event.plateNumber} />
                    </div>
                </div>
                <div className="text-xs text-gray-500">
                    {new Date(event.createdOn).toLocaleTimeString(locale)}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-12 gap-2 items-end">
                    {/* First Name */}
                    <div className="col-span-2">
                        <label className="block text-xs font-medium text-secondary mb-1">
                            {t('realtime.first_name')} *
                        </label>
                        <input
                            type="text"
                            name="ownerFirstName"
                            value={formData.ownerFirstName}
                            onChange={handleChange}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            placeholder={t('realtime.first_name')}
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <div className="col-span-2">
                        <label className="block text-xs font-medium text-secondary mb-1">
                            {t('realtime.last_name')} *
                        </label>
                        <input
                            type="text"
                            name="ownerSurname"
                            value={formData.ownerSurname}
                            onChange={handleChange}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            placeholder={t('realtime.last_name')}
                            required
                        />
                    </div>

                    {/* Vehicle Name */}
                    <div className="col-span-3">
                        <label className="block text-xs font-medium text-secondary mb-1">
                            {t('realtime.vehicle_name')}
                        </label>
                        <input
                            type="text"
                            name="vehicleName"
                            value={formData.vehicleName}
                            onChange={handleChange}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            placeholder={t('realtime.vehicle_name')}
                        />
                    </div>

                    {/* Access Type */}
                    <div className="col-span-2">
                        <label className="block text-xs font-medium text-secondary mb-2">
                            {t('realtime.access_type')} *
                        </label>
                        <RadioButtonGroup
                            value={formData.accessType}
                            onChange={handleAccessTypeChange}
                            options={[
                                { value: t('realtime.entry'), label: t('realtime.entry') },
                                { value: t('realtime.exit'), label: t('realtime.exit') }
                            ]}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-2 flex items-center gap-2">
                        <Button
                            type="submit"
                            size="small"
                            disabled={processing || !formData.accessType}
                            className="flex-1 h-8 flex items-center justify-center"
                        >
                            {processing ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <svg className="w-3 h-3 ltr:mr-1 rtl:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {t('realtime.submit')}
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Delete Button */}
                    <div className="col-span-1 flex items-center gap-2">
                        <Button
                            variant='accent3'
                            size="small"
                            className="flex-1 h-8 flex items-center justify-center"
                            onClick={handleDeleteClick}
                            type="button"
                        >
                            {processing ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <svg className="w-3 h-3 ltr:mr-1 rtl:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    {t('realtime.delete')}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RealTimeAccessHandler;