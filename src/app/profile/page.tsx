"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { profileService } from "@/services/profile";
import { Notificaction } from "@/helpers/utils";

export default function ProfilePage() {
    const { user, loading, login } = useAuth(); // login used to update context
    const { t } = useLanguage();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        avatarUrl: "",
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            setForm({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone?.toString() || "",
                avatarUrl: user.avatarUrl || "",
            });
        }
    }, [user, loading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!user?.email) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("email", user.email);

        setUploading(true);
        try {
            const res = await profileService.uploadAvatar(formData);

            const newAvatarUrl = res.avatarUrl;
            setForm((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));

            // Update context if possible, or at least local state
            // Ideally AuthContext should have an update function, but we can use login to re-set user
            if (user) {
                login({ ...user, avatarUrl: newAvatarUrl });
            }

            Notificaction(t("profile.avatarUpdated"), "success");
        } catch (error) {
            console.error(error);
            Notificaction(t("profile.avatarError"), "error");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedUser = await profileService.updateProfile(form);

            // Update context
            login(updatedUser);

            Notificaction(t("profile.saved"), "success");
        } catch (error) {
            console.error(error);
            Notificaction(t("profile.error"), "error");
        }
    };

    if (loading || !user) return <div className="min-h-screen bg-black text-white flex items-center justify-center">{t("profile.loading")}</div>;

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-6">
            <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                <h1 className="text-3xl font-bold mb-8 text-center">{t("profile.title")}</h1>

                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-32 h-32 mb-4">
                        <img
                            src={form.avatarUrl || "https://via.placeholder.com/150"}
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover border-4 border-green-500"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors"
                            title={t("profile.uploadAvatar")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    {uploading && <p className="text-sm text-gray-400">{t("profile.uploading")}</p>}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t("profile.name")}</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-white/5 border border-gray-600 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t("profile.email")}</label>
                        <input
                            name="email"
                            value={form.email}
                            readOnly
                            className="w-full p-3 rounded-lg bg-white/5 border border-gray-600 text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">{t("profile.phone")}</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg bg-white/5 border border-gray-600 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg transform hover:scale-[1.02]"
                    >
                        {t("profile.save")}
                    </button>
                </form>
            </div>
        </div>
    );
}
