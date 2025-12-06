import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Card, { CardHeader, CardBody } from '../../components/UI/Card';
import OnlineStatus from '../../components/UI/OnlineStatus';
import ExportModal from '../../components/UI/ExportModal';
import RealTimeAccessHandler from '../../components/Access/RealTimeAccessHandler';
import { accessEventAPI } from '../../services/api';
import { PersianPlate } from "../../utils/plateConverter.jsx";

const AccessEventList = () => {
    const { t, i18n } = useTranslation();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [error, setError] = useState(null);
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [showRealTimePanel, setShowRealTimePanel] = useState(true);
    const navigate = useNavigate();


    const handleExport = async (exportData) => {
        setExportLoading(true);
        try {
            const requestData = {
                fromDate: exportData.startDate,
                toDate: exportData.endDate,
                ownerId: exportData.ownerId || null,
                vehicleId: exportData.vehicleId || null
            };

            const response = await accessEventAPI.exportReport(requestData);
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            if (blob.size === 0) {
                throw new Error(t('access_events.export_empty_error'));
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            let fileName = 'access-events-report.xlsx';
            const contentDisposition = response.headers['content-disposition'];

            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename\*?=["']?(?:UTF-8'')?([^;"']*)["']?/i);
                if (fileNameMatch && fileNameMatch[1]) {
                    fileName = decodeURIComponent(fileNameMatch[1]);
                }
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            setExportModalOpen(false);

        } catch (err) {
            console.error('Error exporting report:', err);
            setError(t('access_events.export_error'));
        } finally {
            setExportLoading(false);
        }
    };

    const handleAccessProcessed = async (processedEvent) => {
        try {
            await accessEventAPI.update(processedEvent.id, processedEvent);

            const newEvent = {
                id: processedEvent.id,
                plateNumber: processedEvent.plateNumber,
                vehicleName: processedEvent.isImportant ? t('access_events.special_guest') : t('access_events.guest_vehicle'),
                ownerFirstName: processedEvent.ownerFirstName,
                ownerSureName: processedEvent.ownerSureName,
                gateName: getGateName(processedEvent.gateId),
                isAllowed: true,
                enter: processedEvent.accessType === "ورود",
            };

            setEvents(prev => [newEvent, ...prev]);

        } catch (error) {
            console.error('Error sending processed event to backend:', error);
            alert(t('access_events.send_error'));
        }
    };

    const getGateName = (gateId) => {
        const gates = {
            1: t('access_events.gate_main'),
            2: t('access_events.gate_secondary'),
            3: t('access_events.gate_exit')
        };
        return gates[gateId] || t('access_events.gate_unknown');
    };

    const tableHeader = (
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-primary">{t('access_events.list_title')}</h2>
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="small"
                    onClick={() => setExportModalOpen(true)}
                >
                    <svg className="w-4 h-4 me-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    {t('common.export')}
                </Button>
            </div>
        </div>
    );

    const loadEvents = useCallback(async (showUpdating = false) => {
        try {
            if (showUpdating) {
                setUpdating(true);
            }
            const response = await accessEventAPI.getAll();
            setEvents(response.data);

            const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
            setLastUpdate(new Date().toLocaleTimeString(locale));
        } catch (err) {
            setError(t('access_events.errors.load_error'));
            console.error('Error loading access events:', err);
        } finally {
            setLoading(false);
            setUpdating(false);
        }
    }, [t, i18n.language]);

    useEffect(() => {
        loadEvents();

        const interval = setInterval(() => {
            loadEvents(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [loadEvents]);

    const handleRefresh = () => {
        loadEvents(true);
    };


    const getAccessTypeBadge = (accessType) => {
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                accessType
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-orange-900'
            }`}>
                <span className={`w-1.5 h-1.5 rounded-full ltr:mr-1 rtl:ml-1 ${
                    accessType ? 'bg-green-500' : 'bg-orange-800'
                }`}></span>
                {accessType ? t('access_events.type_entry') : t('access_events.type_exit')}
            </span>
        );
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const eventDate = new Date(date);
        const diffInSeconds = Math.floor((now - eventDate) / 1000);

        if (diffInSeconds < 60) {
            return t('access_events.time_now');
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return t('access_events.time_minutes_ago', { count: minutes });
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return t('access_events.time_hours_ago', { count: hours });
        } else {
            const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
            return eventDate.toLocaleDateString(locale);
        }
    };

    const columns = [
        {
            title: t('access_events.column_id'),
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: t('access_events.column_plate'),
            dataIndex: 'plateNumber',
            key: 'plateNumber',
            render: (plateNumber, record) => (
                <div>
                    <div className="font-semibold pb-2 text-lg text-primary">
                        <PersianPlate plate={plateNumber} />
                    </div>
                    <div className="text-xs text-gray-500">{record.vehicleName || t('common.unknown')}</div>
                    {record.isImportant && (
                        <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            {t('access_events.special_guest')}
                        </span>
                    )}
                </div>
            ),
        },
        {
            title: t('access_events.column_owner'),
            dataIndex: 'ownerSureName',
            key: 'owner',
            render: (sureName, record) => (
                <div>
                    <div className="font-medium text-secondary">
                        {record.ownerFirstName ? `${record.ownerFirstName} ${sureName}` : sureName}
                    </div>
                    {record.processedBy && (
                        <div className="text-xs text-gray-500 mt-1">
                            {t('access_events.processed_by')}: {record.processedBy}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: t('access_events.column_gate'),
            dataIndex: 'gateName',
            key: 'gateName',
        },
        {
            title: t('access_events.column_type'),
            dataIndex: 'enter',
            key: 'enter',
            render: (enter) => getAccessTypeBadge(enter),
        },
        {
            title: t('access_events.column_time'),
            dataIndex: 'createdOn',
            key: 'createdOn',
            render: (date) => {
                const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
                return (
                    <div className="text-sm">
                        <div className="text-primary">{new Date(date).toLocaleTimeString(locale)}</div>
                        <div className="text-gray-500 text-xs">{getTimeAgo(date)}</div>
                    </div>
                );
            },
        },
    ];

    const actions = (event) => (
        <div className="flex gap-2">
            <Button
                variant="accent1"
                size="small"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/access-events/${event.id}`);
                }}
            >
                <svg className="w-4 h-4 justify-self-center ltr:mr-1 rtl:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                {t('common.details')}
            </Button>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-secondary">{t('access_events.loading')}</p>
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-secondary mb-2">{t('common.error_title')}</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Button onClick={handleRefresh}>{t('common.retry')}</Button>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">{t('access_events.page_title')}</h1>
                    <p className="text-secondary mt-2">{t('access_events.page_subtitle')}</p>
                </div>
                <div className="flex items-center gap-4">
                    <OnlineStatus lastUpdate={lastUpdate} isUpdating={updating}/>
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        className="flex items-center"
                        disabled={updating}
                    >
                        <svg className={`w-5 h-5 ltr:mr-2 rtl:ml-2 ${updating ? 'animate-spin' : ''}`} fill="none"
                             stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        {updating ? t('common.updating') : t('common.refresh')}
                    </Button>
                </div>
            </div>

            <div className="flex justify-center">
                <Button
                    onClick={() => setShowRealTimePanel(!showRealTimePanel)}
                    variant={showRealTimePanel ? "secondary" : "primary"}
                    className="flex items-center"
                >
                    <svg className="w-5 h-5 ltr:mr-2 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    {showRealTimePanel ? t('access_events.hide_realtime') : t('access_events.show_realtime')}
                </Button>
            </div>

            <Card className={`border border-primary/20 ${showRealTimePanel ? '' : 'hidden'}`}>
                <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-primary">
                            {t('access_events.realtime_title')}
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600">{t('access_events.realtime_active')}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="py-3">
                    <RealTimeAccessHandler
                        onAccessProcessed={handleAccessProcessed}
                    />
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    {tableHeader}
                </CardHeader>
                <CardBody className="p-0 h-73 overflow-y-auto">
                    {events.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-secondary mb-2">{t('access_events.no_events_title')}</h3>
                            <p className="text-gray-600 mb-6">{t('access_events.no_events_subtitle')}</p>
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            data={events}
                            onRowClick={(event) => navigate(`/access-events/${event.id}`)}
                            actions={actions}
                        />
                    )}
                </CardBody>
            </Card>

            <ExportModal
                isOpen={exportModalOpen}
                onClose={() => setExportModalOpen(false)}
                onExport={handleExport}
                loading={exportLoading}
            />
        </div>
    );
};

export default AccessEventList;