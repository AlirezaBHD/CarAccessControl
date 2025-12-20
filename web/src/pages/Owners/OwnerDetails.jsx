import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import { vehicleOwnerAPI } from '../../services/api';
import { IoCarOutline } from "react-icons/io5";
import { FaCarAlt } from "react-icons/fa";
import BackButton from "../../components/UI/BackButton.jsx";

const OwnerDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOwner();
    }, [id]);

    const loadOwner = async () => {
        try {
            setLoading(true);
            const response = await vehicleOwnerAPI.getById(id);
            setOwner(response.data);
        } catch (err) {
            setError(t('owners.errors.load_details'));
            console.error('Error loading owner:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(t('common.confirm_delete'))) {
            try {
                await vehicleOwnerAPI.delete(id);
                navigate('/owners');
            } catch (err) {
                setError(t('owners.errors.delete_failed'));
                console.error('Error deleting owner:', err);
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
                    <p className="mt-4 text-secondary">{t('owners.loading_details')}</p>
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
                            <Button onClick={() => navigate('/owners')}>
                                {t('common.back_list')}
                            </Button>
                            <Button variant="outline" onClick={loadOwner}>
                                {t('common.retry')}
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    }

    if (!owner) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardBody>
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-secondary mb-2">{t('owners.not_found')}</h3>
                        <p className="text-gray-600 mb-6">{t('owners.not_found_desc')}</p>
                        <Button onClick={() => navigate('/owners')}>
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
                    <h1 className="text-3xl font-bold text-primary">{t('owners.details_title')}</h1>
                    <p className="text-secondary mt-2">{t('owners.details_subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <BackButton navigatePath='/owners'/>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-primary">{t('owners.fields.personal_info')}</h2>
                    </CardHeader>
                    <CardBody>
                        <dl className="divide-y divide-gray-200">
                            <DetailRow
                                label={t('owners.fields.id')}
                                value={owner.id}
                                isCode={true}
                            />
                            <DetailRow
                                label={t('owners.fields.first_name')}
                                value={owner.firstName}
                            />
                            <DetailRow
                                label={t('owners.fields.last_name')}
                                value={owner.surname}
                            />
                            <DetailRow
                                label={t('owners.fields.national_code')}
                                value={owner.nationalCode}
                                isCode={true}
                            />
                            <DetailRow
                                label={t('owners.fields.full_name')}
                                value={`${owner.firstName || ''} ${owner.surname || ''}`.trim()}
                            />
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
                                onClick={() => navigate(`/owners/edit/${id}`)}
                            >
                                <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {t('owners.edit_title')}
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-center"
                                onClick={() => navigate('/vehicles')}
                            >
                                <IoCarOutline className='text-xl' />
                                {t('owners.view_vehicles')}
                            </Button>

                            <Button
                                variant="accent3"
                                className="w-full justify-center"
                                onClick={handleDelete}
                            >
                                <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>

                                {t('common.delete')}
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-primary">{t('owners.fields.vehicles')}</h2>
                            <span className="bg-accent1 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                                {owner.vehicles?.length || 0}
                            </span>
                        </div>
                    </CardHeader>
                    <CardBody>
                        {owner.vehicles && owner.vehicles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 cursor-pointer">
                                {owner.vehicles.map((vehicle) => (
                                    <div
                                        onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                                        key={vehicle.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
                                                <FaCarAlt className="w-5 h-5 text-white" />
                                            </div>
                                            <div className='m-auto'>
                                                <h4 className="font-semibold text-primary text-end">{vehicle.plateNumber}</h4>
                                                <p className="text-sm text-gray-600">{vehicle.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-secondary mb-2">{t('owners.no_vehicles')}</h3>
                                <p className="text-gray-600 mb-6">{t('owners.no_vehicles_desc')}</p>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/vehicles/create')}
                                >
                                    {t('owners.add_vehicle')}
                                </Button>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default OwnerDetails;