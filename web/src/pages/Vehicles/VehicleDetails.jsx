import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import { vehicleAPI, vehicleOwnerAPI } from '../../services/api';
import { PersianPlate } from "../../utils/plateConverter.jsx";
import BackButton from "../../components/UI/BackButton.jsx";

const VehicleDetails = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadVehicle();
    }, [id]);

    const loadVehicle = async () => {
        try {
            setLoading(true);
            const response = await vehicleAPI.getById(id);
            const vehicleData = response.data;
            setVehicle(vehicleData);

            if (vehicleData.ownerId) {
                try {
                    const ownerResponse = await vehicleOwnerAPI.getById(vehicleData.ownerId);
                    setOwner(ownerResponse.data);
                } catch (err) {
                    console.error('Error loading owner:', err);
                }
            }
        } catch (err) {
            setError(t('vehicles.errors.load_details_failed'));
            console.error('Error loading vehicle:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(t('common.confirm_delete'))) {
            try {
                await vehicleAPI.delete(id);
                navigate('/vehicles');
            } catch (err) {
                setError(t('vehicles.errors.delete_failed'));
                console.error('Error deleting vehicle:', err);
            }
        }
    };

    const DetailRow = ({ label, value, isCode = false }) => (
        <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-gray-200 last:border-b-0">
            <dt className="text-sm font-medium text-secondary mb-2 sm:mb-0 sm:w-1/3">
                {label}
            </dt>
            <dd className="text-sm text-primary sm:w-2/3">
                {isCode ? (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono dir-ltr">
                        {value}
                    </code>
                ) : (
                    value || '-'
                )}
            </dd>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-secondary">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardBody>
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-secondary mb-2">{t('common.error')}</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="flex gap-3 justify-center">
                            <Button onClick={() => navigate('/vehicles')}>
                                {t('common.back_list')}
                            </Button>
                            <Button variant="outline" onClick={loadVehicle}>
                                {t('common.retry')}
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    }

    if (!vehicle) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardBody>
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-secondary mb-2">{t('vehicles.not_found')}</h3>
                        <p className="text-gray-600 mb-6">{t('vehicles.not_found_desc')}</p>
                        <Button onClick={() => navigate('/vehicles')}>
                            {t('common.back_list')}
                        </Button>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">{t('vehicles.details_title')}</h1>
                    <p className="text-secondary mt-2">{t('vehicles.details_subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <BackButton navigatePath='/vehicles'/>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-primary">{t('vehicles.details_title')}</h2>
                    </CardHeader>
                    <CardBody>
                        <dl className="divide-y divide-gray-200">
                            <DetailRow
                                label={t('vehicles.fields.id')}
                                value={vehicle.id}
                                isCode={true}
                            />
                            <DetailRow
                                label={t('vehicles.fields.name')}
                                value={vehicle.name}
                            />
                            <DetailRow
                                label={t('vehicles.fields.plate_number')}
                                value=<PersianPlate plate={vehicle.plateNumber} />
                            />
                            <DetailRow
                                label={t('vehicles.fields.created_on')}
                                value={new Date(vehicle.createdOn).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'ar-SA')}
                            />
                            <DetailRow
                                label={t('vehicles.fields.updated_on')}
                                value={new Date(vehicle.modifiedOn).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'ar-SA')}
                            />
                            {vehicle.updatedAt && (
                                <DetailRow
                                    label={t('vehicles.fields.updated_on')}
                                    value={new Date(vehicle.updatedAt).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'ar-SA')}
                                />
                            )}
                        </dl>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-primary">{t('common.actions')}</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            <Button
                                variant="accent1"
                                className="w-full justify-center"
                                onClick={() => navigate(`/vehicles/edit/${id}`)}
                            >
                                <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {t('vehicles.edit_vehicle')}
                            </Button>

                            <Button
                                disabled={true}
                                variant="outline"
                                className="w-full justify-center"
                                onClick={() => {
                                    alert(t('vehicles.history_loading'));
                                }}
                            >
                                <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {t('vehicles.access_history')}
                            </Button>

                            <Button
                                variant="accent3"
                                className="w-full justify-center"
                                onClick={handleDelete}
                            >
                                <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {t('vehicles.delete_vehicle')}
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-primary">{t('vehicles.owner_info')}</h2>
                            {owner && (
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() => navigate(`/owners/${owner.id}`)}
                                >
                                    {t('vehicles.view_owner')}
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardBody>
                        {owner ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-secondary mb-4">{t('owners.personal_info')}</h3>
                                    <dl className="space-y-3">
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-gray-600">{t('owners.fields.full_name')}:</dt>
                                            <dd className="text-sm text-primary">{owner.firstName} {owner.sureName}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-gray-600">{t('owners.fields.national_code')}:</dt>
                                            <dd className="text-sm text-primary">
                                                <code className="bg-gray-100 px-2 py-1 rounded dir-ltr">{owner.nationalCode}</code>
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-gray-600">{t('owners.fields.vehicles_count')}:</dt>
                                            <dd className="text-sm text-primary">
                                                <span className="bg-accent1 text-secondary px-2 py-1 rounded text-xs">
                                                    {owner.vehicles?.length || 0}
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-secondary mb-4">{t('owners.contact_info')}</h3>
                                    <dl className="space-y-3">
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-gray-600">{t('owners.fields.status')}:</dt>
                                            <dd className="text-sm text-primary">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${owner.isActive !== false
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full me-1 ${owner.isActive !== false ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></span>
                                                    {owner.isActive !== false ? t('common.active') : t('common.inactive')}
                                                </span>
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-gray-600">{t('owners.fields.phone')}:</dt>
                                            <dd className="text-sm text-primary"> - </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-gray-600">{t('owners.fields.personnel_code')}:</dt>
                                            <dd className="text-sm text-primary"> - </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-secondary mb-2">{t('owners.not_found')}</h3>
                                <p className="text-gray-600 mb-6">{t('owners.not_found_desc')}</p>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/vehicles/edit/${id}`)}
                                >
                                    {t('vehicles.edit_vehicle')}
                                </Button>
                            </div>
                        )}
                    </CardBody>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-primary">{t('vehicles.access_history')}</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-secondary mb-2">{t('vehicles.access_history')}</h3>
                            <p className="text-gray-600 mb-4">{t('vehicles.view_history')}</p>
                            <Button
                                disabled={true}
                                variant="outline"
                                onClick={() => {
                                    alert(t('vehicles.history_loading'));
                                }}
                            >
                                {t('vehicles.view_history')}
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default VehicleDetails;