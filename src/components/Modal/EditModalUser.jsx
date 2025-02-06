"use client";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { ROLES } from "@/config/permissions";

export default function ModalEdit({ isOpen, closeModal, title, children, user, notif }) {
    if (!user) return null;

    const [editing, setEditing] = useState(false);
    const [rolesDis, setRolesDis] = useState([])
    const [role, setRole] = useState(null)
    useEffect(() => {
        if (user?.role) {
            setRolesDis(Object.values(ROLES).filter(role => role !== user.role));
        } else {
            setRolesDis([]);
        }
    }, [user]);

    const handleEdit = async () => {
        if (editing) return false;

        setEditing(true)
        try {
            const response = await fetch('/api/manage-users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        email: user.email,
                        role: role||user.role,
                    }),
            })
            if (response.ok) {
                notif(200)
                setRolesDis([])
                closeModal();
                return
            } else {
                notif(400)
            }
        } catch (error) {
            notif(500)
        }
    }



    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => { setRolusuario(null); setRolesDis([]); closeModal(); }}>
                <Transition show={isOpen} as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition show={isOpen} as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-end items-center mb-4">
                                    <button
                                        disabled={editing}
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className='flex justify-center items-center'>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        {title}
                                    </h3>
                                </div>
                                <div className='flex justify-center flex-col gap-2 mt-4'>
                                    <input
                                        id="text"
                                        required
                                        value={user.email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors opacity-50 cursor-not-allowed"
                                        disabled
                                    />
                                    <select name="" id="" 
                                    onChange={(e)=>setRole(e.target.value)}
                                    className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors cursor-pointer' defaultValue="">
                                        <option value="" disabled>Seleccione un rol</option>
                                        {rolesDis.map((r, index) =>
                                            <option key={index} value={r}>{r}</option>
                                        )}
                                    </select>
                                    <button
                                        onClick={() => handleEdit()}
                                        type="submit"
                                        disabled={editing}
                                        className={`w-full py-3 mt-5 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium 
                                ${editing ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} 
                                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                                    >
                                        {editing ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </div>

                                <div className="mt-2">
                                    {children}
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
