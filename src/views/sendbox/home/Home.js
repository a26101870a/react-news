import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { Card, Col, Row, List, Avatar, Drawer, Tree } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import * as echarts from 'echarts';
import _ from 'lodash'

const { Meta } = Card;

export default function Home() {
    const [viewList, setViewList] = useState([])
    const [starList, setStarList] = useState([])
    const [allList, setAllList] = useState([])

    const [pieChart, setPieChart] = useState(null)
    const [open, setOpen] = useState(false)

    const barRef = useRef()
    const pieRef = useRef()

    const navigate = useNavigate()
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))

    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6")
            .then(res => {
                setViewList(res.data)
            })
    }, [])

    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6")
            .then(res => {
                setStarList(res.data)
            })
    }, [])

    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category")
            .then(res => {
                renderBarView(_.groupBy(res.data, item => item.category.title))
                setAllList(res.data)
            })

        return () => {
            window.onresize = null
        }
    }, [])

    function renderBarView(obj) {
        //基於準備好的dom，初始化echarts實例
        var myChart = echarts.init(barRef.current);

        // 指定圖表的配置項和數據
        var option = {
            title: {
                text: '新聞分類圖示'
            },
            tooltip: {},
            legend: {
                data: ['數量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: "30",
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '數量',
                    type: 'bar',
                    data: Object.values(obj).map(item => item.length)
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        window.onresize = () => {
            myChart.resize()
        }
    }

    function renderPieView() {
        //數據處理工作allList
        var currentList = allList.filter(item => item.author === username)
        var groupObj = _.groupBy(currentList, item => item.category.title)

        var myChart;
        var option;

        var list = []

        for (let i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length
            })
        }

        if (!pieChart) {
            myChart = echarts.init(pieRef.current)
            setPieChart(myChart)
        } else {
            myChart = pieChart
        }

        option = {
            title: {
                text: '當前用戶新聞分類圖示',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '發布數量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);
    }

    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用戶最常瀏覽" bordered={true}>
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={(item) => <List.Item>
                                <Link to={`/news-manage/preview/${item.id}`}>
                                    {item.title}
                                </Link>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用戶點讚最多" bordered={true}>
                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={(item) => <List.Item>
                                <Link to={`/news-manage/preview/${item.id}`}>
                                    {item.title}
                                </Link>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined
                                key="setting"
                                onClick={() => {
                                    setOpen(true)
                                    setTimeout(() => {
                                        renderPieView()
                                    }, 0)
                                }}
                            />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={username}
                            description={
                                <div>
                                    <b>{region ? region : "全球"}</b>
                                    <span
                                        style={{
                                            paddingLeft: "12px"
                                        }}
                                    >
                                        {roleName}
                                    </span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <Drawer
                title="個人新聞分類"
                placement="right"
                width="500px"
                closable={true}
                onClose={() => {
                    setOpen(false)
                }}
                open={open}
            >
                <div ref={pieRef} style={{
                    width: "100%",
                    height: "400px",
                    marginTop: "30px"
                }}>
                </div>
            </Drawer>
            <div ref={barRef} style={{
                width: "100%",
                height: "400px",
                marginTop: "30px"
            }}>
            </div>
        </div>
    )
}
