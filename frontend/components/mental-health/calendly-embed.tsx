"use client";

import React, { useEffect } from "react";

interface CalendlyEmbedProps {
    url: string;
    title?: string;
}

export function CalendlyEmbed({ url, title }: CalendlyEmbedProps) {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="w-full">
            {title && (
                <h2 className="text-3xl font-semibold text-white mb-6 text-center">{title}</h2>
            )}
            <div
                className="calendly-inline-widget rounded-xl bg-gray-800/50 border border-gray-700/50 w-full"
                data-url={url}
                style={{ minWidth: "100%", height: "800px" }}
            />
        </div>
    );
} 