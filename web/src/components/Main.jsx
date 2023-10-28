import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, theme, Form,  Button } from 'antd';
import { LaptopOutlined, UserOutlined, PlusOutlined,MonitorOutlined } from '@ant-design/icons';
import { useIntl, FormattedMessage } from 'react-intl';
// import axios from "../utils/axios";
import axios from "../utils/axios";
import IPQuery from './IPQuery';
import FileMergeCut from "./FileMergeCut";
import AddFunctionModal from './AddFunctionModal';
const { Header, Content, Sider } = Layout;


const Main = () => {
    const intl = useIntl();
    const { token: { colorBgContainer } } = theme.useToken();
    const [selectedMenuKey, setSelectedMenuKey] = useState("");
    const [breadcrumbItem, setBreadcrumbItem] = useState("");
    const [menuItems, setMenuItems] = useState([]);
    const [showIPQuery, setShowIPQuery] = useState(false);
    const [showFileCut, setShowFileCut] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [params, setParams] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);
    const seriesMapping={"功能":<UserOutlined/>,"系统":<LaptopOutlined/>,"管理":<MonitorOutlined/>}
    const fetchData = async () => {
        try {
            const response = await axios.get("/rule/query");
            const { state, data } = response.data;
            console.log(data);

            if (state) {
                const items = [];

                Object.keys(data).forEach((key) => {
                    const subItems = Object.keys(data[key]).map((subKey) => ({
                        key: `首页/${key}/${subKey}`,
                        label: subKey,
                    }));

                    items.push({
                        key: `首页/${key}`,
                        icon: seriesMapping[key],
                        label: key,
                        children: subItems,
                    });
                });

                setMenuItems(items);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleClick = ({ key }) => {
        const [prefix, type, suffix] = key.split("/");
        let updatedBreadcrumbItem = "";

        if (prefix === "sub") {
            updatedBreadcrumbItem = `${intl.formatMessage({ id: "首页" })}/${type === "function" ? intl.formatMessage({ id: "功能" }) : intl.formatMessage({ id: "系统" })}/${
                suffix.replace("option", intl.formatMessage({ id: "选项" }))
            }`;
        }

        setSelectedMenuKey(key);
        setBreadcrumbItem(updatedBreadcrumbItem);

        if (key === "sub/function/ipQuery") {
            setShowIPQuery(true);
        } else {
            setShowIPQuery(false);
        }
        if (key === "sub/function/fileCut") {
            setShowFileCut(true);
        } else {
            setShowFileCut(false);
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.submit();
    };


    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleAddParam = () => {
        const newParams = [...params];
        newParams.push({ name: '', type: '' });
        setParams(newParams);
    };

    const handleDeleteParam = (index) => {
        const newParams = [...params];
        newParams.splice(index, 1);
        setParams(newParams);
    };

    const handleParamChange = (index, field, value) => {
        const newParams = [...params];
        newParams[index][field] = value;
        setParams(newParams);
    };

    return (
        <Layout>
            <Header style={{ display: "flex", alignItems: "center" }}>
                <div className="demo-logo"></div>
            </Header>
            <Layout>
                {menuItems.length > 0 && (
                    <Sider width={200} style={{ background: colorBgContainer }}>
                        <Menu
                            mode="inline"
                            selectedKeys={[selectedMenuKey]}
                            defaultOpenKeys={menuItems.map((item) => item.key)}
                            style={{ height: "100%", borderRight: 0 }}
                            onClick={handleClick}
                        >
                            {menuItems.map((item, index) => (
                                <Menu.SubMenu
                                    key={item.key}
                                    icon={item.icon}
                                    title={intl.formatMessage({ id: item.label })}
                                    items={item.children}
                                >
                                    {item.children.map((subItem) => (
                                        <Menu.Item key={subItem.key}>
                                            {intl.formatMessage({ id: subItem.label })}
                                        </Menu.Item>
                                    ))}
                                </Menu.SubMenu>
                            ))}
                            <div key="addFunction" style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
                                <Button icon={<PlusOutlined />} onClick={showModal}><FormattedMessage id="添加" /></Button>
                            </div>
                        </Menu>
                        <AddFunctionModal
                            isModalVisible={isModalVisible}
                            handleOk={handleOk}
                            handleCancel={handleCancel}
                            params={params}
                            setParams={setParams}
                            handleAddParam={handleAddParam}
                            handleDeleteParam={handleDeleteParam}
                            handleParamChange={handleParamChange}
                        />
                    </Sider>
                )}
                <Layout style={{ padding: "0 24px 24px" }}>
                    <Breadcrumb style={{ margin: "16px 0" }}>
                        {breadcrumbItem ? (
                            <Breadcrumb.Item>{breadcrumbItem}</Breadcrumb.Item>
                        ) : (
                            <Breadcrumb.Item><FormattedMessage id="首页" /></Breadcrumb.Item>
                        )}
                    </Breadcrumb>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                        }}
                    >
                        {selectedMenuKey && !showIPQuery && !showFileCut && (
                            <div><FormattedMessage id="您选择的是：" />{selectedMenuKey}</div>
                        )}
                        {!selectedMenuKey && <div><FormattedMessage id="欢迎访问首页" /></div>}
                        {showIPQuery && <IPQuery />}
                        {showFileCut && <FileMergeCut />}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default Main;