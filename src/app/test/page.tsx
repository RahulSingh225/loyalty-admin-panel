'use client'
import { useState, useEffect, useRef } from 'react';
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { getSupersetGuestToken } from '@/actions/superset-actions';

const REPORTS_LIST = [
    { id: 1, title: "Sales Overview", type: "dashboard", sid: "13" },
    // SDK primarily supports dashboards. Charts usually need to be on a dashboard.
    // If 161 is just a slice, this might not work directly without being on a dashboard.
    { id: 2, title: "Top Products", type: "dashboard", sid: "161" }
];

export default function ReportPage() {
    const [activeReport, setActiveReport] = useState<any>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeReport && dashboardRef.current) {
            let cancelToken: (() => void) | undefined;

            const mountDashboard = async () => {
                try {
                    // Fetch guest token
                    const { token, supsersetDomain } = await getSupersetGuestToken(activeReport.sid.toString());

                    cancelToken = await embedDashboard({
                        id: activeReport.sid, // given by the Superset embedding UI
                        supersetDomain: supsersetDomain,
                        mountPoint: dashboardRef.current!, // check exists
                        fetchGuestToken: () => Promise.resolve(token),
                        dashboardUiConfig: {
                            hideTitle: true,
                            hideChartControls: true,
                            hideTab: true,
                            filters: {
                                expanded: false,
                            }
                        },
                    });
                } catch (error) {
                    console.error("Error embedding dashboard:", error);
                }
            };

            mountDashboard();

            // Cleanup
            return () => {
                // The SDK currently doesn't export a clean unmount function widely, 
                // but usually clearing the container innerHTML helps before next mount
                // or calling the cancelToken if it's strictly implemented.
                dashboardRef.current.innerHTML = "";
            };
        }
    }, [activeReport]);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Side Card / Sidebar */}
            <aside style={{ width: '280px', background: '#f4f4f4', padding: '20px' }}>
                <h2>Available Reports</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {REPORTS_LIST.map(report => (
                        <li key={report.id} style={{ marginBottom: '10px' }}>
                            <button
                                onClick={() => setActiveReport(report)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '10px',
                                    cursor: 'pointer',
                                    background: activeReport?.id === report.id ? '#ddd' : '#fff',
                                    border: '1px solid #ccc'
                                }}
                            >
                                {report.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Report View */}
            <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {activeReport ? (
                    <div
                        ref={dashboardRef}
                        style={{ width: '100%', height: '100%' }}
                        className="superset-container"
                    />
                ) : (
                    <div style={{ padding: '40px' }}>Select a report from the side card to begin.</div>
                )}
            </main>
        </div>
    );
}