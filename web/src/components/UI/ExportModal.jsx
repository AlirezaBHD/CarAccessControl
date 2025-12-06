import React, { useState, useEffect } from 'react';
import { Datepicker } from '@ijavad805/react-datepicker';
import moment from 'moment';
import 'moment/locale/fa';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import Select from '../../components/UI/Select';
import { vehicleOwnerAPI, vehicleAPI } from '../../services/api';
import {useTranslation} from "react-i18next";

const ExportModal = ({ isOpen, onClose, onExport, loading = false }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        ownerId: '',
        vehicleId: ''
    });

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [owners, setOwners] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadInitialData();
        }
    }, [isOpen]);

    const setTimeToStartOfDay = (date) => {
        if (!date) return '';
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate.toISOString().slice(0, 16);
    };

    const setTimeToEndOfDay = (date) => {
        if (!date) return '';
        const newDate = new Date(date);
        newDate.setHours(23, 59, 59, 999);
        return newDate.toISOString().slice(0, 16);
    };

    const loadInitialData = async () => {
        setLoadingData(true);
        setError(null);

        try {
            const ownersResponse = await vehicleOwnerAPI.getAll();
            const ownersData = ownersResponse.data.map(owner => ({
                id: owner.id,
                name: `${owner.firstName || ''} ${owner.sureName || ''}`.trim(),
                firstName: owner.firstName,
                sureName: owner.sureName,
                nationalCode: owner.nationalCode
            }));
            setOwners(ownersData);

            const vehiclesResponse = await vehicleAPI.getAll();
            const vehiclesData = vehiclesResponse.data.map(vehicle => ({
                id: vehicle.id,
                plateNumber: vehicle.plateNumber,
                name: vehicle.name,
                ownerId: vehicle.ownerId
            }));
            setVehicles(vehiclesData);

        } catch (error) {
            console.error('Error loading data:', error);
            setError(t('access_events.errors.export_error') || t('common.error'));

            setOwners([
                { id: 1, name: t('exportModal.sample_owners.owner1') },
                { id: 2, name: t('exportModal.sample_owners.owner2') },
                { id: 3, name: t('exportModal.sample_owners.owner3') }
            ]);

            setVehicles([
                { id: 1, plateNumber: t('exportModal.sample_vehicles.vehicle1.plate'), name: t('exportModal.sample_vehicles.vehicle1.name') },
                { id: 2, plateNumber: t('exportModal.sample_vehicles.vehicle2.plate'), name: t('exportModal.sample_vehicles.vehicle2.name') },
                { id: 3, plateNumber: t('exportModal.sample_vehicles.vehicle3.plate'), name: t('exportModal.sample_vehicles.vehicle3.name') }
            ]);
        } finally {
            setLoadingData(false);
        }
    };

    const handleDateChange = (type, date) => {
        if (type === 'start') {
            setStartDate(date);
            setFormData(prev => ({
                ...prev,
                startDate: setTimeToStartOfDay(date ? date.toDate() : null)
            }));
        } else {
            setEndDate(date);
            setFormData(prev => ({
                ...prev,
                endDate: setTimeToEndOfDay(date ? date.toDate() : null)
            }));
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);

            if (start > end) {
                alert(t('exportModal.validation.start_date_after_end'));
                return;
            }
        }

        onExport(formData);
    };

    const handleReset = () => {
        setFormData({
            startDate: '',
            endDate: '',
            ownerId: '',
            vehicleId: ''
        });
        setStartDate(null);
        setEndDate(null);
    };

    const getFilteredVehicles = () => {
        if (!formData.ownerId) {
            return vehicles;
        }
        return vehicles.filter(vehicle => vehicle.ownerId.toString() === formData.ownerId.toString());
    };

    const FooterComponent = (momentObj, setValue) => (
        <div className="flex justify-between items-center p-2 border-t border-gray-200">
            <button
                type="button"
                onClick={() => {
                    if (setValue) setValue(moment());
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
                {t('exportModal.datepicker.today')}
            </button>
            <button
                type="button"
                onClick={() => {
                    if (setValue) setValue(null);
                }}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
                {t('exportModal.datepicker.clear')}
            </button>
        </div>
    );

    const CustomInput = (props) => (
        <input
            {...props}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 text-right direction-rtl"
            placeholder={props.placeholder || t('exportModal.datepicker.select_date')}
            readOnly
        />
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('exportModal.title')}
            size="md"
        >
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('exportModal.start_date_label')} *
                    </label>
                    <Datepicker
                        footer={FooterComponent}
                        closeWhenSelectADay={true}
                        disabled={false}
                        format="YYYY-MM-DD"
                        input={<CustomInput placeholder={t('exportModal.datepicker.select_start_date')} />}
                        lang="fa"
                        loading={false}
                        theme="blue"
                        adjustPosition="auto"
                        onChange={(val) => handleDateChange('start', val)}
                    />
                    {formData.startDate && (
                        <p className="text-xs text-gray-500 mt-1">
                            {t('exportModal.time.start_time')}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('exportModal.end_date_label')} *
                    </label>
                    <Datepicker
                        footer={FooterComponent}
                        closeWhenSelectADay={true}
                        disabled={false}
                        format="YYYY-MM-DD"
                        input={<CustomInput placeholder={t('exportModal.datepicker.select_end_date')} />}
                        lang="fa"
                        loading={false}
                        theme="blue"
                        adjustPosition="auto"
                        onChange={(val) => handleDateChange('end', val)}
                        disabledDate={(day) => {
                            if (startDate) {
                                return day.isBefore(startDate, 'day');
                            }
                            return false;
                        }}
                    />
                    {formData.endDate && (
                        <p className="text-xs text-gray-500 mt-1">
                            {t('exportModal.time.end_time')}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('exportModal.owner_label')}
                    </label>
                    <Select
                        value={formData.ownerId}
                        onChange={(value) => {
                            handleChange('ownerId', value);
                            handleChange('vehicleId', '');
                        }}
                        options={[
                            { value: '', label: t('exportModal.all_owners') },
                            ...owners.map(owner => ({
                                value: owner.id.toString(),
                                label: owner.name,
                                data: owner
                            }))
                        ]}
                        placeholder={t('exportModal.select_owner_placeholder')}
                        loading={loadingData}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('exportModal.vehicle_label')}
                    </label>
                    <Select
                        value={formData.vehicleId}
                        onChange={(value) => handleChange('vehicleId', value)}
                        options={[
                            { value: '', label: t('exportModal.all_vehicles') },
                            ...getFilteredVehicles().map(vehicle => ({
                                value: vehicle.id.toString(),
                                label: `${vehicle.plateNumber} - ${vehicle.name}`,
                                data: vehicle
                            }))
                        ]}
                        placeholder={
                            formData.ownerId
                                ? t('exportModal.owner_vehicles_placeholder')
                                : t('exportModal.select_vehicle_placeholder')
                        }
                        loading={loadingData}
                        disabled={loadingData || (formData.ownerId && getFilteredVehicles().length === 0)}
                    />
                    {formData.ownerId && getFilteredVehicles().length === 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                            {t('exportModal.no_vehicles_for_owner')}
                        </p>
                    )}
                </div>

                {(formData.ownerId || formData.vehicleId) && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                            {t('exportModal.applied_filters')}:
                        </h4>
                        <div className="text-xs text-gray-600 space-y-1">
                            {formData.ownerId && (
                                <div>
                                    <span className="font-medium">
                                        {t('exportModal.filters.owner')}:
                                    </span>
                                    {" "}
                                    {owners.find(o => o.id.toString() === formData.ownerId)?.name}
                                </div>
                            )}
                            {formData.vehicleId && (
                                <div>
                                    <span className="font-medium">
                                        {t('exportModal.filters.vehicle')}:
                                    </span>
                                    {" "}
                                    {vehicles.find(v => v.id.toString() === formData.vehicleId)?.plateNumber}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1"
                        disabled={loading}
                    >
                        {t('exportModal.buttons.reset')}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={loading}
                    >
                        {t('exportModal.buttons.cancel')}
                    </Button>
                    <Button
                        type="submit"
                        variant="accent1"
                        loading={loading}
                        disabled={loadingData}
                        className="flex-1"
                    >
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {t('exportModal.buttons.export')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ExportModal;