// Copyright (C) CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Row, Col } from 'antd/lib/grid';
import Title from 'antd/lib/typography/Title';
import Result from 'antd/lib/result';
import Empty from 'antd/lib/empty';
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
    counts: CountRow[];
}

type PageState =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'empty' }
    | { status: 'ready'; counts: CountRow[] };

const core = getCore();

function AnnotationAnalyticsPage(): JSX.Element {
    const { tid } = useParams<{ tid: string }>();
    const [state, setState] = useState<PageState>({ status: 'loading' });

    useEffect(() => {
        let cancelled = false;

        async function load(): Promise<void> {
            setState({ status: 'loading' });
            try {
                const { data } = await core.server.request(
                    `/api/test/annotation-counts/${tid}`,
                    { method: 'GET' },
                ) as { data: CountsResponse };

                if (cancelled) {
                    return;
                }

                if (!data.counts?.length) {
                    setState({ status: 'empty' });
                    return;
                }

                setState({ status: 'ready', counts: data.counts });
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
    }, [tid]);

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
            <Empty description='No annotations found for this task.' />
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
                                text: 'Top 20 classes by annotation count',
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
                    {body}
                </Col>
            </Row>
        </div>
    );
}

export default AnnotationAnalyticsPage;
