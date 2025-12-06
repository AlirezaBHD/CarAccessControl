import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsPersonFill } from "react-icons/bs";
import { LuTrafficCone } from "react-icons/lu";
import { FaCarAlt } from "react-icons/fa";
import { BiSolidCctv } from "react-icons/bi";
import { IoBarChart } from "react-icons/io5";
import { CgFileDocument } from "react-icons/cg";
import { MdPeopleAlt } from "react-icons/md";

const Sidebar = () => {
    const location = useLocation();
    const { t } = useTranslation();

    const menuItems = [
        { id: 1, name: t('sidebar.dashboard'), icon: <IoBarChart />, path: '/dashboard' },
        { id: 2, name: t('cameras.title'), icon: <BiSolidCctv />, path: '/cameras' },
        { id: 3, name: t('vehicles.title'), icon: <FaCarAlt />, path: '/vehicles' },
        { id: 4, name: t('owners.title'), icon: <MdPeopleAlt />, path: '/owners' },
        { id: 5, name: t('gates.title'), icon: <LuTrafficCone/>, path: '/gates' },
        { id: 6, name: t('access_events.title'), icon: <CgFileDocument />, path: '/access-events' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-67 bg-primary text-white flex flex-col transition-all duration-300">
            {/* Logo */}
            <div className="p-6 border-b border-accent2/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent1 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold text-lg"><LuTrafficCone/></span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{t('sidebar.access_control')}</h2>
                        <p className="text-accent1 text-sm">{t('sidebar.admin_panel')}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <Link
                                to={item.path}
                                className={`
                                  flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                                  ${isActive(item.path)
                                    ? 'bg-accent2 text-white shadow-lg'
                                    : 'text-white hover:bg-secondary hover:text-white'
                                }
                                `}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium text-white">{item.name}</span>

                                {isActive(item.path) && (
                                    <div className="w-1 h-6 font-bold bg-accent1 rounded-full ms-auto"></div>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-accent2/30">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                    <div className="w-10 h-10 bg-accent3 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white font-bold">AB</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="font-medium text-sm truncate">{t('sidebar.system_admin')}</p>
                        <p className="text-gray-400 text-xs truncate" dir='ltr'>a.bahmanzade.contact@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;