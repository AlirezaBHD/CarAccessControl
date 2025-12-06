import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UI/Button';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import { gateAPI, cameraAPI } from '../../services/api';
import BackButton from "../../components/UI/BackButton.jsx";

const GateDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [gate, setGate] = useState(null);
    const [camera, setCamera] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadGate();
    }, [id]);

    const loadGate = async () => {
        try {
            setLoading(true);
            const response = await gateAPI.getById(id);
            const gateData = response.data;
            setGate(gateData);

            if (gateData.cameraId) {
                try {
                    const cameraResponse = await cameraAPI.getById(gateData.cameraId);
                    setCamera(cameraResponse.data);
                } catch (err) {
                    console.error('Error loading camera:', err);
                }
            }
        } catch (err) {
            setError(t('gates.details_load_error'));
            console.error('Error loading gate:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(t('common.confirm_delete'))) {
            try {
                await gateAPI.delete(id);
                navigate('/gates');
            } catch (err) {
                setError(t('gates.delete_error'));
                console.error('Error deleting gate:', err);
            }
        }
    };

    const DetailRow = ({ label, value, isCode = false, isUrl = false }) => (
        <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-gray-200 last:border-b-0">
            <dt className="text-sm font-medium text-secondary mb-2 sm:mb-0 sm:w-1/3">
                {label}
            </dt>
            <dd className="text-sm text-primary sm:w-2/3">
                {isUrl ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-accent2 transition-colors duration-200 break-all dir-ltr text-start"
                    >
                        {value}
                    </a>
                ) : isCode ? (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono dir-ltr">
                        {value}
                    </code>
                ) : (
                    value || '-'
                )}
            </dd>
        </div>
    );

    const StatusBadge = ({ isActive }) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
            <span className={`w-2 h-2 rounded-full me-2 ${isActive ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {isActive ? t('common.active') : t('common.inactive')}
        </span>
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
                            <Button onClick={() => navigate('/gates')}>
                                {t('common.back_list')}
                            </Button>
                            <Button variant="outline" onClick={loadGate}>
                                {t('common.retry')}
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    }

    if (!gate) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardBody>
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4M12 4v16" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-secondary mb-2">{t('gates.not_found')}</h3>
                        <p className="text-gray-600 mb-6">{t('gates.not_found_desc')}</p>
                        <Button onClick={() => navigate('/gates')}>
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
                    <h1 className="text-3xl font-bold text-primary">{t('gates.details_title')}</h1>
                    <p className="text-secondary mt-2">{t('gates.details_subtitle')}</p>
                </div>
                <div className="flex gap-3">
                    <BackButton navigatePath='/gates'/>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-primary">{t('gates.fields.main_info')}</h2>
                    </CardHeader>
                    <CardBody>
                        <dl className="divide-y divide-gray-200">
                            <DetailRow
                                label={t('gates.fields.id')}
                                value={gate.id}
                                isCode={true}
                            />
                            <DetailRow
                                label={t('gates.fields.name')}
                                value={gate.name}
                            />
                            <DetailRow
                                label={t('gates.fields.location')}
                                value={gate.location}
                            />
                            <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-gray-200 last:border-b-0">
                                <dt className="text-sm font-medium text-secondary mb-2 sm:mb-0 sm:w-1/3">
                                    {t('gates.fields.status')}
                                </dt>
                                <dd className="text-sm text-primary sm:w-2/3">
                                    <StatusBadge isActive={gate.isActive} />
                                </dd>
                            </div>
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
                                onClick={() => navigate(`/gates/edit/${id}`)}
                            >
                                <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {t('gates.edit_gate')}
                            </Button>

                            <Button
                                disabled={true}
                                variant="outline"
                                className="w-full justify-center"
                                onClick={() => {
                                    alert(t('gates.testing'));
                                }}
                            >
                                <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {t('gates.test_op')}
                            </Button>

                            <Button
                                variant="accent3"
                                className="w-full justify-center"
                                onClick={handleDelete}
                            >
                                <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {t('gates.delete_gate')}
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-primary">{t('gates.connected_camera')}</h2>
                            {camera && (
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() => navigate(`/cameras/${camera.id}`)}
                                >
                                    {t('gates.view_camera')}
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardBody>
                        {camera ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-secondary mb-4">{t('gates.camera_info')}</h3>
                                    <dl className="space-y-3">
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-gray-600">{t('gates.fields.camera_ip')}:</dt>
                                            <dd className="text-sm text-primary">
                                                <code className="bg-gray-100 px-2 py-1 rounded dir-ltr">{camera.ip}</code>
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-gray-600">{t('gates.fields.stream_url')}:</dt>
                                            <dd className="text-sm text-primary">
                                                <a
                                                    href={camera.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:text-accent2 transition-colors duration-200"
                                                >
                                                    {t('gates.view')}
                                                </a>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-secondary mb-4">{t('gates.tech_info')}</h3>
                                    <dl className="space-y-3">
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-gray-600">{t('gates.fields.frame_interval')}:</dt>
                                            <dd className="text-sm text-primary">{camera.frameInterval} ms</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-gray-600">{t('gates.fields.status')}:</dt>
                                            <dd className="text-sm text-primary">
                                                <StatusBadge isActive={true} />
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-secondary mb-2">{t('gates.camera_not_found')}</h3>
                                <p className="text-gray-600 mb-6">{t('gates.camera_not_found_desc')}</p>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/gates/edit/${id}`)}
                                >
                                    {t('gates.edit_gate')}
                                </Button>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default GateDetails;