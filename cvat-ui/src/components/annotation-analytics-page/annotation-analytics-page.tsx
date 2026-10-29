// Copyright (C) CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';

import React, {
    useCallback, useEffect, useMemo, useState,
} from 'react';
import { useParams } from 'react-router';
import { Row, Col } from 'antd/lib/grid';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import Result from 'antd/lib/result';
import Empty from 'antd/lib/empty';
import Alert from 'antd/lib/alert';
import InputNumber from 'antd/lib/input-number';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title as ChartTitle,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getCore } from 'cvat-core-wrapper';

import CVATLoadingSpinner from 'components/common/loading-spinner';
import GoBackButton from 'components/common/go-back-button';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

interface CountRow {
    label: string;
    count: number;
}

interface CountsResponse {
    task_id: number;
    min_count?: number;
    counts: CountRow[];
}

type PageState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'empty' }
    | { status: 'ready'; counts: CountRow[] };

const core = getCore();
const DEFAULT_MIN_COUNT = 10;

function wsUrl(taskId: string, minCount: number): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/api/test/ws/annotation-counts/${taskId}?min_count=${minCount}`;
}

function AnnotationAnalyticsPage(): JSX.Element {
    const { tid } = useParams<{ tid: string }>();
    const [minCount, setMinCount] = useState(DEFAULT_MIN_COUNT);
    const [state, setState] = useState<PageState>({ status: 'loading' });
    const [liveConnected, setLiveConnected] = useState(false);

    const applyCounts = useCallback((counts: CountRow[] | undefined) => {
        if (!counts?.length) {
            setState({ status: 'empty' });
            return;
        }
        setState({ status: 'ready', counts });
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function load(): Promise<void> {
            setState({ status: 'loading' });
            try {
                const { data } = await core.server.request(
                    `/api/test/annotation-counts/${tid}?min_count=${minCount}`,
                    { method: 'GET' },
                ) as { data: CountsResponse };

                if (cancelled) {
                    return;
                }

                applyCounts(data.counts);
            } catch (error: unknown) {
                if (cancelled) {
                    return;
                }

                const message = error instanceof Error ? error.message : 'Failed to load annotation counts';
                setState({ status: 'error', message });
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [tid, minCount, applyCounts]);

    useEffect(() => {
        if (!tid) {
            return undefined;
        }

        let ws: WebSocket | null = null;
        let reconnectTimer: number | null = null;
        let cancelled = false;

        function connect(): void {
            ws = new WebSocket(wsUrl(tid, minCount));
            ws.onopen = () => {
                if (!cancelled) {
                    setLiveConnected(true);
                }
            };
            ws.onmessage = (event) => {
                if (cancelled) {
                    return;
                }
                try {
                    const payload = JSON.parse(event.data) as CountsResponse;
                    applyCounts(payload.counts);
                } catch {
                    // ignore malformed frames
                }
            };
            ws.onclose = () => {
                setLiveConnected(false);
                if (!cancelled) {
                    reconnectTimer = window.setTimeout(connect, 2000);
                }
            };
            ws.onerror = () => {
                ws?.close();
            };
        }

        connect();

        return () => {
            cancelled = true;
            if (reconnectTimer !== null) {
                window.clearTimeout(reconnectTimer);
            }
            ws?.close();
        };
    }, [tid, minCount, applyCounts]);

    const chartData = useMemo(() => {
        if (state.status !== 'ready') {
            return null;
        }

        const top = state.counts.slice(0, 20);

        return {
            labels: top.map((row) => row.label),
            datasets: [{
                label: 'Annotations',
                data: top.map((row) => row.count),
                backgroundColor: 'rgba(24, 144, 255, 0.65)',
            }],
        };
    }, [state]);

    let body: JSX.Element;

    if (state.status === 'loading') {
        body = <CVATLoadingSpinner />;
    } else if (state.status === 'error') {
        body = (
            <Result
                status='error'
                title='Could not load annotation analytics'
                subTitle={state.message}
            />
        );
    } else if (state.status === 'empty') {
        body = (
            <Empty description='No annotations found for this task at the current filter.' />
        );
    } else {
        body = (
            <div className='cvat-annotation-analytics-chart'>
                <Bar
                    data={chartData!}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { display: false },
                            title: {
                                display: true,
                                text: `Classes with at least ${minCount} annotations (top 20 shown)`,
                            },
                        },
                    }}
                />
            </div>
        );
    }

    return (
        <div className='cvat-annotation-analytics-page'>
            <Row justify='center' align='middle'>
                <Col span={22}>
                    <GoBackButton />
                    <Title level={3}>
                        Annotation analytics (task #
                        {tid}
                        )
                    </Title>
                    <Row align='middle' gutter={16} className='cvat-annotation-analytics-controls'>
                        <Col>
                            <Text>Minimum count per class:</Text>
                        </Col>
                        <Col>
                            <InputNumber
                                min={0}
                                value={minCount}
                                onChange={(value) => setMinCount(typeof value === 'number' ? value : 0)}
                            />
                        </Col>
                    </Row>
                    {!liveConnected && state.status === 'ready' && (
                        <Alert
                            type='warning'
                            showIcon
                            message='Live connection paused — retrying every 2 seconds'
                            className='cvat-annotation-analytics-live-alert'
                        />
                    )}
                    {body}
                </Col>
            </Row>
        </div>
    );
}

export default AnnotationAnalyticsPage;
