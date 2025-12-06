import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../UI/Button';
import Card, { CardHeader, CardBody } from '../UI/Card';

const RealTimeAccessCard = ({ onAccessRecorded, currentEvents = [] }) => {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        plateNumber: '',
        firstName: '',
        sureName: '',
        accessType: t('realtime.entry'),
        isImportant: false,
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [recentEvents, setRecentEvents] = useState([]);

    useEffect(() => {
        if (currentEvents.length > 0) {
            setRecentEvents(currentEvents.slice(0, 3));
        }
    }, [currentEvents]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.plateNumber.trim()) {
            alert(t('realtime.enter_plate'));
            return;
        }

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newAccessRecord = {
                id: Date.now(),
                plateNumber: formData.plateNumber,
                firstName: formData.firstName,
                sureName: formData.sureName,
                accessType: formData.accessType,
                isImportant: formData.isImportant,
                notes: formData.notes,
                timestamp: new Date().toISOString(),
                status: t('realtime.recorded')
            };

            if (onAccessRecorded) {
                onAccessRecorded(newAccessRecord);
            }

            setFormData({
                plateNumber: '',
                firstName: '',
                sureName: '',
                accessType: t('realtime.entry'),
                isImportant: false,
                notes: ''
            });

            alert(t('realtime.record_success'));

        } catch (error) {
            console.error('Error recording access:', error);
            alert(t('realtime.record_error'));
        } finally {
            setLoading(false);
        }
    };

    const getAccessTypeBadge = (type) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            type === t('realtime.entry')
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1 ${
                type === t('realtime.entry') ? 'bg-green-500' : 'bg-blue-500'
            }`}></span>
            {type}
        </span>
    );

    const getStatusBadge = (status) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            status === t('realtime.recorded')
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-gray-100 text-gray-800'
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1 ${
                status === t('realtime.recorded') ? 'bg-emerald-500' : 'bg-gray-500'
            }`}></span>
            {status}
        </span>
    );

    const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';

    return (
        <div className="space-y-4">
            {/* Manual Recording Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-primary">{t('realtime.manual_record')}</h3>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-green-600">{t('realtime.ready')}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Plate Number */}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">
                                    {t('realtime.plate_number')} *
                                </label>
                                <input
                                    type="text"
                                    name="plateNumber"
                                    value={formData.plateNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-center text-lg font-bold"
                                    placeholder="12ب12345"
                                    required
                                />
                            </div>

                            {/* Access Type */}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">
                                    {t('realtime.access_type')}
                                </label>
                                <select
                                    name="accessType"
                                    value={formData.accessType}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    <option value={t('realtime.entry')}>{t('realtime.entry')}</option>
                                    <option value={t('realtime.exit')}>{t('realtime.exit')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">
                                    {t('realtime.guest_first_name')}
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder={t('realtime.guest_first_name')}
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">
                                    {t('realtime.guest_last_name')}
                                </label>
                                <input
                                    type="text"
                                    name="sureName"
                                    value={formData.sureName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder={t('realtime.guest_last_name')}
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1">
                                {t('realtime.notes')}
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder={t('realtime.notes_placeholder')}
                            />
                        </div>

                        {/* Important Checkbox */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isImportant"
                                name="isImportant"
                                checked={formData.isImportant}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                            />
                            <label htmlFor="isImportant" className="text-sm font-medium text-secondary">
                                {t('realtime.special_guest')}
                            </label>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ltr:mr-2 rtl:ml-2"></div>
                                    {t('realtime.recording')}
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 ltr:mr-2 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {t('realtime.record_traffic')}
                                </>
                            )}
                        </Button>
                    </form>
                </CardBody>
            </Card>

            {/* Recent Events Card */}
            {recentEvents.length > 0 && (
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-primary">{t('realtime.recent_traffic')}</h3>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-3">
                            {recentEvents.map((event, index) => (
                                <div
                                    key={event.id || index}
                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${
                                            event.isAllowed ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                        <div>
                                            <div className="font-semibold text-primary">
                                                {event.plateNumber}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {event.ownerFirstName ? `${event.ownerFirstName} ${event.ownerSureName}` : event.ownerSureName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getAccessTypeBadge(event.accessType || t('realtime.entry'))}
                                        <span className="text-xs text-gray-500">
                                            {new Date(event.createdOn).toLocaleTimeString(locale)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
};

export default RealTimeAccessCard;