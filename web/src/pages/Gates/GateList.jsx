import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import { gateAPI, cameraAPI } from '../../services/api';
import { LuTrafficCone } from "react-icons/lu";
import { BiCctv } from "react-icons/bi";

const GateList = () => {
    const { t } = useTranslation();
    const [gates, setGates] = useState([]);
    const [cameras, setCameras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [gatesResponse, camerasResponse] = await Promise.all([
                gateAPI.getAll(),
                cameraAPI.getAll()
            ]);
            setGates(gatesResponse.data);
            setCameras(camerasResponse.data);
        } catch (err) {
            setError(t('gates.errors.load_failed'));
            console.error('Error loading data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('common.confirm_delete'))) {
            try {
                await gateAPI.delete(id);
                loadData();
            } catch (err) {
                setError(t('gates.delete_error'));
                console.error('Error deleting gate:', err);
            }
        }
    };

    const getStatusBadge = (isActive) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
            <span className={`w-2 h-2 rounded-full me-2 ${isActive ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {isActive ? t('common.active') : t('common.inactive')}
        </span>
    );

    const columns = [
        {
            title: t('gates.fields.id'),
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: t('gates.fields.name'),
            dataIndex: 'name',
            key: 'name',
            render: (name) => (
                <div>
                    <div className="font-semibold text-primary">{name}</div>
                </div>
            ),
        },
        {
            title: t('gates.fields.location'),
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: t('gates.fields.camera_ip'),
            dataIndex: 'cameraIp',
            key: 'camera',
            render: (cameraIp) => (
                <span className="bg-accent1 text-secondary px-3 py-1 rounded-full text-sm font-medium dir-ltr">
                    {cameraIp}
                </span>
            ),
        },
        {
            title: t('gates.fields.status'),
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => getStatusBadge(isActive),
        },
    ];

    const actions = (gate) => (
        <div className="flex gap-2">
            <Button
                variant="accent1"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/gates/${gate.id}`);
                }}
            >
                <svg className="w-4 h-4 ms-1 justify-self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {t('common.details')}
            </Button>
            <Button
                variant="accent2"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/gates/edit/${gate.id}`);
                }}
            >
                <svg className="w-4 h-4 ms-1 justify-self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {t('common.edit')}
            </Button>
            <Button
                variant="accent3"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(gate.id);
                }}
            >
                <svg className="w-4 h-4 ms-1 justify-self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t('common.delete')}
            </Button>
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
                        <Button onClick={loadData}>{t('common.retry')}</Button>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">{t('gates.title')}</h1>
                    <p className="text-secondary mt-2">{t('gates.subtitle')}</p>
                </div>
                <Button
                    onClick={() => navigate('/gates/create')}
                    className="flex items-center"
                >
                    <svg className="w-5 h-5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('gates.new_gate')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card hover>
                    <CardBody>
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center me-4">
                                <LuTrafficCone className='text-blue-600 text-xl' />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">{t('gates.stats.total')}</p>
                                <p className="text-2xl font-bold text-primary">{gates.length}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card hover>
                    <CardBody>
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center me-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">{t('gates.stats.active')}</p>
                                <p className="text-2xl font-bold text-primary">
                                    {gates.filter(gate => gate.isActive).length}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card hover>
                    <CardBody>
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center me-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">{t('gates.stats.inactive')}</p>
                                <p className="text-2xl font-bold text-primary">
                                    {gates.filter(gate => !gate.isActive).length}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card hover>
                    <CardBody>
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center me-4">
                                <BiCctv className='text-purple-600 text-xl' />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">{t('gates.stats.connected_cams')}</p>
                                <p className="text-2xl font-bold text-primary">
                                    {new Set(gates.map(gate => gate.cameraId)).size}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-primary">{t('gates.title')}</h2>
                    </div>
                </CardHeader>
                <CardBody className="p-0 h-120 overflow-y-auto">
                    {gates.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4M12 4v16" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-secondary mb-2">{t('gates.no_gates')}</h3>
                            <p className="text-gray-600 mb-6">{t('gates.no_gates_desc')}</p>
                            <Button onClick={() => navigate('/gates/create')}>
                                {t('gates.add_first')}
                            </Button>
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            data={gates}
                            onRowClick={(gate) => navigate(`/gates/${gate.id}`)}
                            actions={actions}
                        />
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default GateList;