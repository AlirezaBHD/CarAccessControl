import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import { vehicleOwnerAPI } from '../../services/api';
import { FaCarAlt } from "react-icons/fa";

const OwnerList = () => {
    const { t } = useTranslation();
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadOwners();
    }, []);

    const loadOwners = async () => {
        try {
            setLoading(true);
            const response = await vehicleOwnerAPI.getAll();
            setOwners(response.data);
        } catch (err) {
            setError(t('owners.errors.load_failed'));
            console.error('Error loading owners:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('common.confirm_delete'))) {
            try {
                await vehicleOwnerAPI.delete(id);
                loadOwners();
            } catch (err) {
                setError(t('owners.errors.delete_failed'));
                console.error('Error deleting owner:', err);
            }
        }
    };

    const columns = [
        {
            title: t('owners.fields.id'),
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: t('owners.fields.first_name'),
            dataIndex: 'firstName',
            key: 'firstName',
            render: (firstName) => (
                <div>
                    <div className="font-semibold text-primary">{firstName}</div>
                </div>
            ),
        },
        {
            title: t('owners.fields.last_name'),
            dataIndex: 'surname',
            key: 'surname',
        },
        {
            title: t('owners.fields.national_code'),
            dataIndex: 'nationalCode',
            key: 'nationalCode',
            render: (code) => (
                <code className="bg-gray-100 px-2 py-1 rounded text-sm dir-ltr">{code}</code>
            ),
        },
        {
            title: t('owners.fields.vehicles_count'),
            dataIndex: 'vehiclesCount',
            key: 'vehiclesCount',
            render: (vehiclesCount) => (
                <span className="bg-accent1 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                    {vehiclesCount}
                </span>
            ),
        },
    ];

    const actions = (owner) => (
        <div className="flex gap-2">
            <Button
                variant="accent1"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/owners/${owner.id}`);
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
                    navigate(`/owners/edit/${owner.id}`);
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
                    handleDelete(owner.id);
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
                        <Button onClick={loadOwners}>{t('common.retry')}</Button>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">{t('owners.title')}</h1>
                    <p className="text-secondary mt-2">{t('owners.subtitle')}</p>
                </div>
                <Button
                    onClick={() => navigate('/owners/create')}
                    className="flex items-center"
                >
                    <svg className="w-5 h-5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('owners.new_owner')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card hover>
                    <CardBody>
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center me-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">{t('owners.stats.total')}</p>
                                <p className="text-2xl font-bold text-primary">{owners.length}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card hover>
                    <CardBody>
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center me-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">{t('owners.stats.active')}</p>
                                <p className="text-2xl font-bold text-primary">
                                    {owners.filter(owner => owner.isActive !== false).length}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card hover>
                    <CardBody>
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center me-4">
                                <FaCarAlt className='text-purple-600' />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">{t('owners.stats.total_vehicles')}</p>
                                <p className="text-2xl font-bold text-primary">
                                    {owners.reduce((acc, owner) => acc + (owner.vehiclesCount), 0)}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card hover>
                    <CardBody>
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center me-4">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">{t('owners.stats.avg_vehicles')}</p>
                                <p className="text-2xl font-bold text-primary">
                                    {(owners.reduce((acc, owner) => acc + (owner.vehiclesCount), 0) / owners.length || 0).toFixed(1)}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-primary">{t('owners.list_title')}</h2>
                    </div>
                </CardHeader>
                <CardBody className="p-0 h-120 overflow-y-auto">
                    {owners.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-secondary mb-2">{t('owners.no_owners')}</h3>
                            <p className="text-gray-600 mb-6">{t('owners.no_owners_desc')}</p>
                            <Button onClick={() => navigate('/owners/create')}>
                                {t('owners.add_first')}
                            </Button>
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            data={owners}
                            onRowClick={(owner) => navigate(`/owners/${owner.id}`)}
                            actions={actions}
                        />
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default OwnerList;