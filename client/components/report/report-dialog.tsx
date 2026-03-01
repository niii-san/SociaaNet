"use client";

import React, { useState } from "react";
import { submitReport } from "@/features/moderator/moderator.api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";

const reportReasons = [
    { value: "spam", label: "Spam" },
    { value: "harassment", label: "Harassment" },
    { value: "hate_speech", label: "Hate Speech" },
    { value: "violence", label: "Violence" },
    { value: "nudity", label: "Nudity" },
    { value: "false_information", label: "False Information" },
    { value: "intellectual_property", label: "Intellectual Property" },
    { value: "self_harm", label: "Self Harm" },
    { value: "other", label: "Other" }
];

interface ReportDialogProps {
    targetId: string;
    targetType: "post" | "reel" | "comment" | "user";
    open: boolean;
    onClose: () => void;
}

export function ReportDialog({
    targetId,
    targetType,
    open,
    onClose
}: ReportDialogProps) {
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    if (!open) return null;

    const handleSubmit = async () => {
        if (!reason) return;
        setLoading(true);
        setError("");
        try {
            await submitReport({
                target_id: targetId,
                target_type: targetType,
                reason,
                description: description.trim() || undefined
            });
            setSubmitted(true);
        } catch (err: any) {
            const msg =
                err?.response?.data?.message || "Failed to submit report";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setReason("");
        setDescription("");
        setSubmitted(false);
        setError("");
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={handleClose}
        >
            <div
                className="bg-background rounded-xl border border-border p-6 w-full max-w-md space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                {submitted ? (
                    <>
                        <div className="text-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                                <Flag className="w-6 h-6 text-green-500" />
                            </div>
                            <h3 className="font-semibold text-lg">
                                Report Submitted
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Thank you for reporting. Our moderators will
                                review this content.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleClose}
                            >
                                Done
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2">
                            <Flag className="w-5 h-5 text-red-500" />
                            <h3 className="font-semibold text-lg">
                                Report {targetType}
                            </h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Why are you reporting this {targetType}?
                        </p>

                        {/* Reason Selection */}
                        <div className="grid grid-cols-2 gap-2">
                            {reportReasons.map((r) => (
                                <button
                                    key={r.value}
                                    onClick={() => setReason(r.value)}
                                    className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                                        reason === r.value
                                            ? "border-primary bg-primary/10 text-primary font-medium"
                                            : "border-border hover:bg-muted text-foreground"
                                    }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>

                        {/* Description */}
                        <Textarea
                            placeholder="Add more details (optional)..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className="text-sm"
                        />

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleSubmit}
                                disabled={!reason || loading}
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1" />
                                ) : (
                                    <Flag className="w-4 h-4 mr-1" />
                                )}
                                Submit Report
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
