import React, {useState, useEffect, useCallback} from 'react';
import { useTranslation } from 'react-i18next';
import Card, {CardHeader, CardBody} from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import OnlineStatus from '../../components/UI/OnlineStatus';
import RealTimeAccessHandler from '../../components/Access/RealTimeAccessHandler';
import {RiTrafficLightLine} from "react-icons/ri";
import {MdPeopleAlt} from "react-icons/md";
import {LuTrafficCone} from "react-icons/lu";
import {FaCarAlt} from "react-icons/fa";

const Dashboard = () => {
    const { t, i18n } = useTranslation();
    const [stats, setStats] = useState({
        todayAccess: 0,
        totalVehicles: 0,
        totalOwners: 0,
        activeGates: 0
    });
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(null);

    const [accessChartData, setAccessChartData] = useState([]);
    const [gateStats, setGateStats] = useState([]);



    const loadDashboardData = useCallback(async (showLoading = true) => {
        if (showLoading) {
            setLoading(true);
        }

        try {
            setStats({
                todayAccess: 142,
                totalVehicles: 89,
                totalOwners: 67,
                activeGates: 3
            });

            setAccessChartData([
                {hour: '08:00', access: 23},
                {hour: '10:00', access: 45},
                {hour: '12:00', access: 67},
                {hour: '14:00', access: 34},
                {hour: '16:00', access: 56},
                {hour: '18:00', access: 28}
            ]);

            setGateStats([
                {gate: t('access_events.gates.main'), access: 89},
                {gate: t('access_events.gates.sub'), access: 34},
                {gate: t('access_events.gates.exit'), access: 19}
            ]);

            setLastUpdate(new Date().toLocaleTimeString(i18n.language === 'en' ? 'en-US' : 'ar-au'));
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    },[t, i18n.language]);

    useEffect(() => {
        loadDashboardData();

        const interval = setInterval(() => {
            loadDashboardData(false);
        }, 30000);

        return () => clearInterval(interval);
    }, [loadDashboardData]);

    const StatCard = ({title, value, icon, color, change}) => (
        <Card className={`border-l-4 border-l-${color} hover:shadow-lg transition-shadow duration-200 rtl:border-l-0 rtl:border-r-4 rtl:border-r-${color}`}>
            <CardBody className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-secondary mb-1">{title}</p>
                        <p className="text-3xl font-bold text-primary">{loading ? '...' : value}</p>
                        {change && (
                            <p className={`text-xs mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'} dir-ltr text-right`}>
                                {change > 0 ? '↑' : '↓'} {Math.abs(change)}% {t('dashboard.from_yesterday')}
                            </p>
                        )}
                    </div>
                    <div className={`p-3 rounded-full bg-${color} bg-opacity-10`}>
                        {icon}
                    </div>
                </div>
            </CardBody>
        </Card>
    );

    const SimpleBarChart = ({data, title, color = 'primary'}) => (
        <Card>
            <CardHeader>
                <h3 className="text-lg font-semibold text-primary">{title}</h3>
            </CardHeader>
            <CardBody>
                <div className="space-y-2">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-secondary flex-1">{item.hour || item.gate}</span>
                            <div className="flex items-center gap-2 flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`bg-${color} h-2 rounded-full`}
                                        style={{width: `${(item.access / Math.max(...data.map(d => d.access))) * 100}%`}}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium text-primary w-8 text-end">
                                    {item.access}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );

    const icons = {
        access: <RiTrafficLightLine className="w-6 h-6 text-white"/>,
        vehicle: <FaCarAlt className="w-6 h-6 text-white"/>,
        owner: <MdPeopleAlt className="w-6 h-6 text-white"/>,
        gate: <LuTrafficCone className="w-6 h-6 text-white"/>
    };

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">{t('dashboard.title')}</h1>
                    <p className="text-secondary mt-2">{t('dashboard.subtitle')}</p>
                </div>
                <div className="flex items-center gap-4">
                    <OnlineStatus lastUpdate={lastUpdate}/>
                    <Button
                        onClick={() => loadDashboardData()}
                        variant="outline"
                        className="flex items-center"
                    >
                        <svg className="w-5 h-5 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        {t('dashboard.refresh')}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title={t('dashboard.today_access')}
                    value={stats.todayAccess}
                    icon={icons.access}
                    color="primary"
                    change={12}
                />
                <StatCard
                    title={t('dashboard.total_vehicles')}
                    value={stats.totalVehicles}
                    icon={icons.vehicle}
                    color="accent1"
                    change={5}
                />
                <StatCard
                    title={t('dashboard.total_owners')}
                    value={stats.totalOwners}
                    icon={icons.owner}
                    color="accent2"
                    change={8}
                />
                <StatCard
                    title={t('dashboard.active_gates')}
                    value={stats.activeGates}
                    icon={icons.gate}
                    color="accent3"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <SimpleBarChart
                        data={accessChartData}
                        title={t('dashboard.hourly_chart')}
                        color="primary"
                    />

                    <SimpleBarChart
                        data={gateStats}
                        title={t('dashboard.gate_stats')}
                        color="accent1"
                    />
                </div>

                <div className="space-y-6">
                    <Card className="border">
                        <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-primary">
                                    {t('dashboard.real_time_panel')}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="pe-1 text-xs text-green-600">{t('common.active')}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="py-3">
                            <RealTimeAccessHandler
                                onAccessProcessed={() => loadDashboardData(false)}
                            />
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold text-primary">{t('dashboard.recent_activity.title')}</h3>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-3">
                                {[1, 2, 3].map((item) => (
                                    <div key={item}
                                         className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                                        <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-primary">
                                                {t('access_events.fields.plate')}: <span className='border-1 mx-1 rounded-xs px-0.5 dir-ltr inline-block'>11 | 345 B 12</span>
                                            </p>
                                            <p className="text-xs pt-1 text-gray-500">
                                                {t('dashboard.entry_from')} {t('access_events.gates.main')} - 2 {t('dashboard.minutes_ago')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;