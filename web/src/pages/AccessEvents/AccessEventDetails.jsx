import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import { accessEventAPI, API_CONFIG } from '../../services/api';
import { FaCarAlt } from 'react-icons/fa';
import { BsPersonFill } from "react-icons/bs";
import { LuTrafficCone } from "react-icons/lu";
import { PersianPlate } from "../../utils/plateConverter.jsx";

const AccessEventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadEvent();
    }, [id]);

    const loadEvent = async () => {
        try {
            setLoading(true);
            const response = await accessEventAPI.getById(id);
            setEvent(response.data);
        } catch (err) {
            setError(t('access_events.load_error'));
            console.error('Error loading access event:', err);
        } finally {
            setLoading(false);
        }
    };

    const DetailRow = ({ label, value, isCode = false, isLink = false, linkTo = '' }) => (
        <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-gray-200 last:border-b-0">
            <dt className="text-sm font-medium text-secondary mb-2 sm:mb-0 sm:w-1/3">
                {label}
            </dt>
            <dd className="text-sm text-primary sm:w-2/3">
                {isLink && linkTo ? (
                    <Button
                        variant="ghost"
                        size="small"
                        onClick={() => navigate(linkTo)}
                        className="p-0 h-auto text-primary"
                    >
                        {value}
                    </Button>
                ) : isCode ? (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {value}
                    </code>
                ) : (
                    value || '-'
                )}
            </dd>
        </div>
    );

    const StatusBadge = ({ isAllowed }) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isAllowed
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
        }`}>
            <span className={`w-2 h-2 rounded-full ltr:mr-2 rtl:ml-2 ${
                isAllowed ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {isAllowed ? t('access_events.status_allowed') : t('access_events.status_denied')}
        </span>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-secondary">{t('access_events.loading_details')}</p>
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
                        <h3 className="text-lg font-semibold text-secondary mb-2">{t('common.error_title')}</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="flex gap-3 justify-center">
                            <Button onClick={() => navigate('/access-events')}>
                                {t('common.back_list')}
                            </Button>
                            <Button variant="outline" onClick={loadEvent}>
                                {t('common.retry')}
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    }

    if (!event) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardBody>
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-secondary mb-2">{t('access_events.not_found_title')}</h3>
                        <p className="text-gray-600 mb-6">{t('access_events.not_found_subtitle')}</p>
                        <Button onClick={() => navigate('/access-events')}>
                            {t('common.back_list')}
                        </Button>
                    </div>
                </CardBody>
            </Card>
        );
    }

    const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">{t('access_events.details_title')}</h1>
                    <p className="text-secondary mt-2">{t('access_events.details_subtitle')}</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => navigate('/access-events')}
                    className="flex items-center"
                >
                    <svg className="w-5 h-5 ltr:mr-2 rtl:ml-2 rtl:scale-x-[-1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t('common.back_list')}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-primary">{t('access_events.main_info')}</h2>
                            <StatusBadge isAllowed={event.isAllowed} />
                        </div>
                    </CardHeader>
                    <CardBody>
                        <dl className="divide-y divide-gray-200">
                            <DetailRow
                                label={t('access_events.column_plate')}
                                value={<PersianPlate plate={event.plateNumber} />}
                                isLink={event.vehicleId && true}
                                linkTo={`/vehicles/${event.vehicleId}`}
                            />
                            <DetailRow
                                label={t('access_events.vehicle_name')}
                                value={event.vehicleName}
                                isLink={event.vehicleId && true}
                                linkTo={`/vehicles/${event.vehicleId}`}
                            />
                            <DetailRow
                                label={t('access_events.column_owner')}
                                value={event.ownerFirstName ? `${event.ownerFirstName} ${event.ownerSurname}` : event.ownerSurname}
                                isLink={event.ownerId && true}
                                linkTo={`/owners/${event.ownerId}`}
                            />
                            <DetailRow
                                label={t('access_events.column_gate')}
                                value={event.gateName}
                                isLink={true}
                                linkTo={`/gates/${event.gateId}`}
                            />
                            <DetailRow
                                label={t('access_events.camera')}
                                value={event.cameraIp}
                                isCode={true}
                                isLink={true}
                                linkTo={`/cameras/${event.cameraId}`}
                            />
                            <DetailRow
                                label={t('access_events.column_time')}
                                value={new Date(event.createdOn).toLocaleString(locale)}
                            />
                        </dl>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-primary">{t('access_events.recorded_image')}</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="text-center">
                            {event.imagePath ? (
                                <div className="space-y-4">
                                    <img
                                        src={`${API_CONFIG.BASE_URL}/${event.imagePath}`}
                                        alt={`${t('access_events.plate_image')} ${event.plateNumber}`}
                                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <div className="hidden bg-gray-100 rounded-lg p-8">
                                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600">{t('access_events.image_not_available')}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => window.open(`${API_CONFIG.BASE_URL}/${event.imagePath}`, '_blank')}
                                    >
                                        <svg className="w-4 h-4 ltr:mr-2 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        {t('access_events.view_full_image')}
                                    </Button>
                                </div>
                            ) : (
                                <div className="bg-gray-100 rounded-lg p-8">
                                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">{t('access_events.no_image_recorded')}</p>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-primary">{t('access_events.related_entities')}</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                        <FaCarAlt className="text-white" />
                                    </div>
                                    <h3 className="font-semibold text-primary">{t('access_events.vehicle')}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    {t('access_events.column_plate')}: <code className="bg-gray-100 px-1 rounded">{event.plateNumber}</code>
                                </p>
                                <p className="text-sm text-gray-600 mb-3">
                                    {t('access_events.vehicle_name')}: {event.vehicleName || t('common.unknown')}
                                </p>
                                <Button
                                    variant="outline"
                                    disabled={event.vehicleId === 0}
                                    size="small"
                                    onClick={() => navigate(`/vehicles/${event.vehicleId}`)}
                                    className="w-full"
                                >
                                    {t('access_events.view_vehicle')}
                                </Button>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-accent2 rounded-full flex items-center justify-center">
                                        <BsPersonFill className="text-white" />
                                    </div>
                                    <h3 className="font-semibold text-primary">{t('access_events.owner')}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    {t('access_events.owner_name')}: {event.ownerFirstName ? `${event.ownerFirstName} ${event.ownerSurname}` : event.ownerSurname}
                                </p>
                                <p className="text-sm text-gray-600 mb-3">
                                    {t('access_events.owner_id')}: {event.ownerId === 0 ? '' : event.ownerId}
                                </p>
                                <Button
                                    variant="outline"
                                    size="small"
                                    disabled={event.ownerId === 0}
                                    onClick={() => navigate(`/owners/${event.ownerId}`)}
                                    className="w-full"
                                >
                                    {t('access_events.view_owner')}
                                </Button>
                            </div>

                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-accent3 rounded-full flex items-center justify-center">
                                        <LuTrafficCone className="text-white" />
                                    </div>
                                    <h3 className="font-semibold text-primary">{t('access_events.gate_camera')}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    {t('access_events.column_gate')}: {event.gateName}
                                </p>
                                <p className="text-sm text-gray-600 mb-3">
                                    {t('access_events.camera')}: {event.cameraIp}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="small"
                                        onClick={() => navigate(`/gates/${event.gateId}`)}
                                        className="flex-1"
                                    >
                                        {t('access_events.gate')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="small"
                                        onClick={() => navigate(`/cameras/${event.cameraId}`)}
                                        className="flex-1"
                                    >
                                        {t('access_events.camera_short')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default AccessEventDetails;