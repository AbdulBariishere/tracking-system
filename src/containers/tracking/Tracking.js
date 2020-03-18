import React, { Component } from "react";
import L, { FeatureGroup } from "leaflet";
import ReactDOM from "react-dom";
import { Map, Polyline } from "react-leaflet";
import base64 from "base-64";
import MarkerClusterGroup from "react-leaflet-markercluster";

import RotatedMarker from "react-leaflet-rotatedmarker";
import {
  Layout,
  Menu,
  Breadcrumb,
  List,
  Typography,
  Avatar,
  Input,
  Badge,
  Drawer,
  Button
} from "antd";
import {
  UserOutlined,
  CarOutlined,
  FieldTimeOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  NodeIndexOutlined,
  HistoryOutlined
} from "@ant-design/icons";
import "antd/dist/antd.css";
import "../tracking/Tracking.css";
import InfiniteScroll from "react-infinite-scroller";
import Tilelayer from "../../components/Tilelayer";
import { NavLink } from "react-router-dom";
 
const myicon = new L.Icon({
  iconUrl: require("C:/Users/Administrator/Desktop/Tracking System/src/assets/icons/Bus_Running_NORTH.png"),
  iconSize: new L.Point(25, 35)
});

const myicon2 = new L.Icon({
  iconUrl: require("C:/Users/Administrator/Desktop/Tracking System/src/assets/icons/Bus_Stopped_NORTH.png"),
  iconSize: new L.Point(25, 35)
});
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Search } = Input;

const data = [
  {
    title: "Vehicle001"
  },
  {
    title: "Vehicle002"
  },
  {
    title: "Vehicle003"
  },
  {
    title: "Vehicle004"
  },
  {
    title: "Vehicle001"
  },
  {
    title: "Vehicle002"
  },
  {
    title: "Vehicle003"
  },
  {
    title: "Vehicle004"
  }
];
const data1 = [
  "Speed: 32km /hr.",
  "Time: WED 15:28 11-03-2020.",
  "Latitude: 254564.00.",
  "Logitude: 2548.2365.",
  "Distance: 254km.",
  "Total Distance: 12547km.",
  "Today Distance: 45km."
];

export default class Tracking extends Component {
  constructor(props) {
    super(props);
    this.handleRunning = this.handleRunning.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleIdle = this.handleIdle.bind(this);
    this.handleInactive = this.handleInactive.bind(this);
    this.handleNodata = this.handleNodata.bind(this);
    this.handleTotalDevices = this.handleTotalDevices.bind(this);
    // this.toggleDrawer = this.toggleDrawer.bind(this);
    this.state = {
      positionData: [],
      previouspositionData: [],
      deviceData: [],
      specificdevice: [],
      specificdeviceId: "",
      lat: [],
      lng: [],
      coords :[],
      enablePolyline: false,
      zoom: 8,
      minzoom: 4,
      tempLat: "",
      tempLong: "",
      c1: 22.690306666666665,
      c2: 75.92346333333333,
      displayscrollpane: false,
      visible: false,
      Statuscount: [],
      RunningVehicle: [],
      StopVehicle: [],
      IdleVehicle: [],
      InactiveVehicle: [],
      NoDataVehicle: [],
      TotalVehicle: [],
      specificdevice: [],
      running: false,
      stop: false,
      idle: false,
      inactive: false,
      nodata: false,
      total: false,
      openSidebar: false,
      right: false
    };
  }
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  componentDidMount() {
    this.getlatestposition();
    this.interval = setInterval(() => {
      this.getlatestposition();
    }, 10000);
  }

  getlatestposition() {
    var email = JSON.parse(localStorage.getItem("email"));
    var password = JSON.parse(localStorage.getItem("password"));
    let headers = new Headers();

    //headers.append('Content-Type', 'text/json');
    headers.set(
      "Authorization",
      "Basic " + base64.encode(email + ":" + password)
    );
    fetch("http://13.233.112.236:8082/api/positions", {
      method: "GET",
      // body: data,
      headers: headers
    }).then(response => {
      response.json().then(data => {
     
        this.setState({ positionData: JSON.parse(JSON.stringify(data)) });
     
  
        if (this.state.enablePolyline == true) {
          for (let i = 0; i < this.state.positionData.length; i++) {
            
           
            if ( this.state.positionData[i].deviceId == this.state.specificdeviceId) {
              
             
              this.setState({
                coords: this.state.coords.concat({'lat':this.state.positionData[i].latitude,'lng':this.state.positionData[i].longitude}),
               
              });
              console.log(this.state.coords);
            
             
            }
          }
        }
      });
    });

    fetch("http://13.233.112.236:8082/api/devices/statuscount", {
      method: "GET",
      // body: data,
      headers: headers
    }).then(response => {
      response.json().then(data => {
        this.setState({ Statuscount: data });
      });
    });
    this.handleTotalDevices();
  }

  handleRunning(e) {
    var email = JSON.parse(localStorage.getItem("email"));
    var password = JSON.parse(localStorage.getItem("password"));
    let headers = new Headers();

    //headers.append('Content-Type', 'text/json');
    headers.set(
      "Authorization",
      "Basic " + base64.encode(email + ":" + password)
    );

    fetch("http://13.233.112.236:8082/api/devices/running", {
      method: "GET",
      // body: data,
      headers: headers
    }).then(response => {
      response.json().then(data => {
        this.setState({ RunningVehicle: data });
        this.setState({ running: true });
        this.setState({ stop: false });
        this.setState({ idle: false });
        this.setState({ inactive: false });
        this.setState({ nodata: false });
        this.setState({ total: false });
      });
    });
  }

  handleStop(e) {
    var email = JSON.parse(localStorage.getItem("email"));
    var password = JSON.parse(localStorage.getItem("password"));
    let headers = new Headers();

    //headers.append('Content-Type', 'text/json');
    headers.set(
      "Authorization",
      "Basic " + base64.encode(email + ":" + password)
    );

    fetch("http://13.233.112.236:8082/api/devices/stop", {
      method: "GET",
      // body: data,
      headers: headers
    }).then(response => {
      response.json().then(data => {
        this.setState({ StopVehicle: data });
        this.setState({ running: false });
        this.setState({ stop: true });
        this.setState({ idle: false });
        this.setState({ inactive: false });
        this.setState({ nodata: false });
        this.setState({ total: false });
      });
    });
  }

  handleIdle(e) {
    var email = JSON.parse(localStorage.getItem("email"));
    var password = JSON.parse(localStorage.getItem("password"));
    let headers = new Headers();

    //headers.append('Content-Type', 'text/json');
    headers.set(
      "Authorization",
      "Basic " + base64.encode(email + ":" + password)
    );

    fetch("http://13.233.112.236:8082/api/devices/idle", {
      method: "GET",
      // body: data,
      headers: headers
    }).then(response => {
      response.json().then(data => {
        this.setState({ IdleVehicle: data });
        this.setState({ running: false });
        this.setState({ stop: false });
        this.setState({ idle: true });
        this.setState({ inactive: false });
        this.setState({ nodata: false });
        this.setState({ total: false });
      });
    });
  }

  handleInactive(e) {
    var email = JSON.parse(localStorage.getItem("email"));
    var password = JSON.parse(localStorage.getItem("password"));
    let headers = new Headers();

    //headers.append('Content-Type', 'text/json');
    headers.set(
      "Authorization",
      "Basic " + base64.encode(email + ":" + password)
    );

    fetch("http://13.233.112.236:8082/api/devices/inactive", {
      method: "GET",
      // body: data,
      headers: headers
    }).then(response => {
      response.json().then(data => {
        this.setState({ InactiveVehicle: data });
        this.setState({ running: false });
        this.setState({ stop: false });
        this.setState({ idle: false });
        this.setState({ inactive: true });
        this.setState({ nodata: false });
        this.setState({ total: false });
      });
    });
  }

  handleNodata(e) {
    var email = JSON.parse(localStorage.getItem("email"));
    var password = JSON.parse(localStorage.getItem("password"));
    let headers = new Headers();

    //headers.append('Content-Type', 'text/json');
    headers.set(
      "Authorization",
      "Basic " + base64.encode(email + ":" + password)
    );

    fetch("http://13.233.112.236:8082/api/devices/nodata", {
      method: "GET",
      // body: data,
      headers: headers
    }).then(response => {
      response.json().then(data => {
        this.setState({ NodataVehicle: data });
        this.setState({ running: false });
        this.setState({ stop: false });
        this.setState({ idle: false });
        this.setState({ inactive: false });
        this.setState({ nodata: true });
        this.setState({ total: false });
      });
    });
  }

  handleTotalDevices(e) {
    var email = JSON.parse(localStorage.getItem("email"));
    var password = JSON.parse(localStorage.getItem("password"));
    let headers = new Headers();

    //headers.append('Content-Type', 'text/json');
    headers.set(
      "Authorization",
      "Basic " + base64.encode(email + ":" + password)
    );

    fetch("http://13.233.112.236:8082/api/devices/totaldevices", {
      method: "GET",
      // body: data,
      headers: headers
    }).then(response => {
      response.json().then(data => {
      
        this.setState({ TotalVehicle: data });
        this.setState({ total: true });
        this.setState({ running: false });
        this.setState({ stop: false });
        this.setState({ idle: false });
        this.setState({ inactive: false });
        this.setState({ nodata: false });
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  showAttributes = e => {
    this.setState({ zoom: 12 });
    this.setState({ c1: e.latitude });
    this.setState({ c2: e.longitude });
    this.setState({ visible: true });
    this.setState({enablePolyline :true});
    this.setState({specificdeviceId :e.deviceId});
    var email = JSON.parse(localStorage.getItem("email"));
    var password = JSON.parse(localStorage.getItem("password"));
    let headers = new Headers();
    this.setState({ tempLat: e.latitude, tempLong: e.longitude });

    //headers.append('Content-Type', 'text/json');
    headers.set(
      "Authorization",
      "Basic " + base64.encode(email + ":" + password)
    );

    fetch("http://13.233.112.236:8082/api/devices/specificdevice?id=" + e.deviceId, {
      method: "GET",
      // body: data,
      headers: headers
    }).then(response => {
      response.json().then(data => {
        this.setState({ specificdevice: data });
      });
    });
    this.getlatestposition();
    this.getlatestposition();

  };
  sidebarShowAttributes = e => {
    var temprops = JSON.parse(JSON.stringify(this.props));

    temprops.zoom = 17;
    temprops.c1 = e.id;
    temprops.c2 = e.longitude;
    this.setState({ visible: true });
    Object.preventExtensions(temprops);
    
    var email = JSON.parse(localStorage.getItem("email"));
    var password = JSON.parse(localStorage.getItem("password"));
    let headers = new Headers();

    //headers.append('Content-Type', 'text/json');
    headers.set(
      "Authorization",
      "Basic " + base64.encode(email + ":" + password)
    );

    fetch("http://13.233.112.236:8082/api/devices/specificdevice?id=" + e.deviceid, {
      method: "GET",
      // body: data,
      headers: headers
    }).then(response => {
      response.json().then(data => {
        this.setState({ specificdevice: data });
      });
    });
    this.setState({ zoom: 16 });
    this.setState({ c1: e.latitude });
    this.setState({ c2: e.longitude });
    this.setState({enablePolyline :true});
    this.setState({specificdeviceId :e.deviceId});
    this.getlatestposition();
    this.getlatestposition();

  };
  constructPolyline = e => {};
  render() {
    return (
      <div>
        <Layout>
          <Header className="custom-header">
            <div className="logo" style={{ fontSize: "20px" }}>
              Tracknovate
            </div>
          </Header>
          <Layout>
            <Sider width={330} className="site-layout-background">
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                style={{ height: "100%", borderRight: 0 }}
              >
                <SubMenu
                  key="sub1"
                  title={
                    <span style={{ fontSize: "20px" }}>
                      <UserOutlined />
                      Hii {JSON.parse(localStorage.getItem("email"))}
                    </span>
                  }
                >
                  <Search
                    placeholder="input search text"
                   // onSearch={value }
                    style={{
                      width: 300,
                      marginLeft: "10px",
                      marginBottom: "5px"
                    }}
                  />
                </SubMenu>
                <table
                  cellPadding="5"
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                >
                  {" "}
                  {this.state.Statuscount.map(Statuscount => (
                    <tr>
                      <td>
                        <Badge
                          onClick={this.handleRunning}
                          count={
                            Statuscount.RUNNING == "0"
                              ? "0"
                              : Statuscount.RUNNING
                          }
                          style={{
                            backgroundColor: "#52c41a",
                            marginLeft: "16px"
                          }}
                          showZero={true}
                        />
                      </td>
                      <td>
                        <Badge
                          onClick={this.handleIdle}
                          count={
                            Statuscount.IDLE == "0" ? "0" : Statuscount.IDLE
                          }
                          style={{
                            backgroundColor: "#FF8C00",
                            marginLeft: "5px"
                          }}
                          showZero={true}
                        />
                      </td>
                      <td>
                        <Badge
                          onClick={this.handleStop}
                          count={Statuscount.STOP}
                          style={{ marginLeft: "19px" }}
                        />
                      </td>
                      <td>
                        <Badge
                          onClick={this.handleInactive}
                          count={Statuscount.INACTIVE}
                          style={{
                            backgroundColor: "#01388c",
                            marginLeft: "15px"
                          }}
                        />
                      </td>
                      <td>
                        <Badge
                          onClick={this.handleNodata}
                          count={Statuscount.NODATA}
                          style={{
                            backgroundColor: "#808080",
                            marginLeft: "15px"
                          }}
                        />
                      </td>
                      <td>
                        <Badge
                          onClick={this.handleTotalDevices}
                          count={Statuscount.TOTAL}
                          overflowCount={999}
                          style={{ backgroundColor: "#000", marginLeft: "5px" }}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>Running</td>
                    <td>Idle</td>
                    <td>Stopped</td>
                    <td>Inactive</td>
                    <td>Nodata</td>
                    <td>Total</td>
                  </tr>
                </table>
                <div
                  className="demo-infinite-container"
                  style={{ marginTop: "15px" }}
                >
                  <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}
                  >
                    {this.state.running == true
                      ? this.state.RunningVehicle.map(RunningVehicle => (
                          <List itemLayout="horizontal">
                            <List.Item
                              onClick={this.showDrawer}
                              style={{ cursor: "pointer" }}
                              className="hover-onBjects"
                            >
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    icon={<CarOutlined />}
                                    style={{
                                      fontStyle: "20px",
                                      color: "#52c41a",
                                      backgroundColor: "#ECECEC"
                                    }}
                                  />
                                }
                                title={
                                  <a
                                    onClick={() =>
                                      this.sidebarShowAttributes(RunningVehicle)
                                    }
                                  >
                                    {RunningVehicle.name}
                                  </a>
                                }
                                description="Moving"
                              />
                              <FieldTimeOutlined />
                              &nbsp;<span>
                                {RunningVehicle.servertime}
                              </span>{" "}
                              &nbsp;
                              <DashboardOutlined
                                style={{
                                  position: "absolute",
                                  marginTop: "-17%"
                                }}
                              />{" "}
                              &nbsp;
                              <span
                                style={{
                                  position: "absolute",
                                  marginTop: "-18.5%",
                                  marginLeft: "10px"
                                }}
                              >
                                {RunningVehicle.speed}
                              </span>
                            </List.Item>
                          </List>
                        ))
                      : null}

                    {this.state.idle == true
                      ? this.state.IdleVehicle.map(IdleVehicle => (
                          <List itemLayout="horizontal">
                            <List.Item
                              onClick={this.showDrawer}
                              style={{ cursor: "pointer" }}
                              className="hover-onBjects"
                            >
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    icon={<CarOutlined />}
                                    style={{
                                      fontStyle: "20px",
                                      color: "orange",
                                      backgroundColor: "#ECECEC"
                                    }}
                                  />
                                }
                                title={
                                  <a
                                    onClick={() =>
                                      this.sidebarShowAttributes(IdleVehicle)
                                    }
                                  >
                                    {IdleVehicle.name}
                                  </a>
                                }
                                description="Moving"
                              />
                              <FieldTimeOutlined />
                              &nbsp;<span>{IdleVehicle.servertime}</span> &nbsp;
                              <DashboardOutlined
                                style={{
                                  position: "absolute",
                                  marginTop: "-17%"
                                }}
                              />{" "}
                              &nbsp;
                              <span
                                style={{
                                  position: "absolute",
                                  marginTop: "-18.5%",
                                  marginLeft: "10px"
                                }}
                              >
                                {IdleVehicle.speed}
                              </span>
                            </List.Item>
                          </List>
                        ))
                      : null}

                    {this.state.stop == true
                      ? this.state.StopVehicle.map(StopVehicle => (
                          <List itemLayout="horizontal">
                            <List.Item
                              onClick={this.showDrawer}
                              style={{ cursor: "pointer" }}
                              className="hover-onBjects"
                            >
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    icon={<CarOutlined />}
                                    style={{
                                      fontStyle: "20px",
                                      color: "red",
                                      backgroundColor: "#ECECEC"
                                    }}
                                  />
                                }
                                title={
                                  <a
                                    onClick={() =>
                                      this.sidebarShowAttributes(StopVehicle)
                                    }
                                  >
                                    {StopVehicle.name}
                                  </a>
                                }
                                description="Moving"
                              />
                              <FieldTimeOutlined />
                              &nbsp;<span>{StopVehicle.servertime}</span> &nbsp;
                              <DashboardOutlined
                                style={{
                                  position: "absolute",
                                  marginTop: "-17%"
                                }}
                              />{" "}
                              &nbsp;
                              <span
                                style={{
                                  position: "absolute",
                                  marginTop: "-18.5%",
                                  marginLeft: "10px"
                                }}
                              >
                                {StopVehicle.speed}
                              </span>
                            </List.Item>
                          </List>
                        ))
                      : null}

                    {this.state.inactive == true
                      ? this.state.InactiveVehicle.map(InactiveVehicle => (
                          <List itemLayout="horizontal">
                            <List.Item
                              onClick={this.showDrawer}
                              style={{ cursor: "pointer" }}
                              className="hover-onBjects"
                            >
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    icon={<CarOutlined />}
                                    style={{
                                      fontStyle: "20px",
                                      color: "blue",
                                      backgroundColor: "#ECECEC"
                                    }}
                                  />
                                }
                                title={
                                  <a
                                    onClick={() =>
                                      this.sidebarShowAttributes(
                                        InactiveVehicle
                                      )
                                    }
                                  >
                                    {InactiveVehicle.name}
                                  </a>
                                }
                                description="Moving"
                              />
                              <FieldTimeOutlined />
                              &nbsp;<span>
                                {InactiveVehicle.servertime}
                              </span>{" "}
                              &nbsp;
                              <DashboardOutlined
                                style={{
                                  position: "absolute",
                                  marginTop: "-17%"
                                }}
                              />{" "}
                              &nbsp;
                              <span
                                style={{
                                  position: "absolute",
                                  marginTop: "-18.5%",
                                  marginLeft: "10px"
                                }}
                              >
                                {InactiveVehicle.speed}
                              </span>
                            </List.Item>
                          </List>
                        ))
                      : null}

                    {this.state.nodata == true
                      ? this.state.NodataVehicle.map(NodataVehicle => (
                          <List itemLayout="horizontal">
                            <List.Item
                              onClick={this.showDrawer}
                              style={{ cursor: "pointer" }}
                              className="hover-onBjects"
                            >
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    icon={<CarOutlined />}
                                    style={{
                                      fontStyle: "20px",
                                      color: "grey",
                                      backgroundColor: "#ECECEC"
                                    }}
                                  />
                                }
                                title={
                                  <a
                                    onClick={() =>
                                      this.sidebarShowAttributes(NodataVehicle)
                                    }
                                  >
                                    {NodataVehicle.name}
                                  </a>
                                }
                                description="Moving"
                              />
                              <FieldTimeOutlined />
                              &nbsp;<span>{NodataVehicle.servertime}</span>{" "}
                              &nbsp;
                              <DashboardOutlined
                                style={{
                                  position: "absolute",
                                  marginTop: "-17%"
                                }}
                              />{" "}
                              &nbsp;
                              <span
                                style={{
                                  position: "absolute",
                                  marginTop: "-18.5%",
                                  marginLeft: "10px"
                                }}
                              >
                                {NodataVehicle.speed}
                              </span>
                            </List.Item>
                          </List>
                        ))
                      : null}

                    {this.state.total == true
                      ? this.state.TotalVehicle.map(TotalVehicle => (
                          <List itemLayout="horizontal">
                            <List.Item
                              onClick={this.showDrawer}
                              style={{ cursor: "pointer" }}
                              className="hover-onBjects"
                            >
                              {TotalVehicle.speed > 0.0 ? (
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      icon={<CarOutlined />}
                                      style={{
                                        fontStyle: "20px",
                                        color: "#52c41a",
                                        backgroundColor: "#ECECEC"
                                      }}
                                    />
                                  }
                                  title={
                                    <a
                                      onClick={() =>
                                        this.sidebarShowAttributes(TotalVehicle)
                                      }
                                    >
                                      {TotalVehicle.name}
                                    </a>
                                  }
                                  description="RUNNING"
                                />
                              ) : TotalVehicle.speed == 0.0 &&
                                TotalVehicle.ignition == "true" ? (
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      icon={<CarOutlined />}
                                      style={{
                                        fontStyle: "20px",
                                        color: "orange",
                                        backgroundColor: "#ECECEC"
                                      }}
                                    />
                                  }
                                  title={
                                    <a
                                      onClick={() =>
                                        this.sidebarShowAttributes(TotalVehicle)
                                      }
                                    >
                                      {TotalVehicle.name}
                                    </a>
                                  }
                                  description="IDLE"
                                />
                              ) : TotalVehicle.speed == 0.0 &&
                                TotalVehicle.ignition == "false" &&
                                TotalVehicle.network != "null" ? (
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      icon={<CarOutlined />}
                                      style={{
                                        fontStyle: "20px",
                                        color: "red",
                                        backgroundColor: "#ECECEC"
                                      }}
                                    />
                                  }
                                  title={
                                    <a
                                      onClick={() =>
                                        this.sidebarShowAttributes(TotalVehicle)
                                      }
                                    >
                                      {TotalVehicle.name}
                                    </a>
                                  }
                                  description="Stopped"
                                />
                              ) : TotalVehicle.network == "null" &&
                                TotalVehicle.speed == 0.0 ? (
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      icon={<CarOutlined />}
                                      style={{
                                        fontStyle: "20px",
                                        color: "blue",
                                        backgroundColor: "#ECECEC"
                                      }}
                                    />
                                  }
                                  title={
                                    <a
                                      onClick={() =>
                                        this.sidebarShowAttributes(TotalVehicle)
                                      }
                                    >
                                      {TotalVehicle.name}
                                    </a>
                                  }
                                  description="Inactive"
                                />
                              ) : (
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      icon={<CarOutlined />}
                                      style={{
                                        fontStyle: "20px",
                                        color: "grey",
                                        backgroundColor: "#ECECEC"
                                      }}
                                    />
                                  }
                                  title={
                                    <a
                                      onClick={() =>
                                        this.sidebarShowAttributes(TotalVehicle)
                                      }
                                    >
                                      {TotalVehicle.name}
                                    </a>
                                  }
                                  description="No Data"
                                />
                              )}
                              <FieldTimeOutlined />
                              &nbsp;<span>{TotalVehicle.servertime}</span>{" "}
                              &nbsp;
                              <DashboardOutlined
                                style={{
                                  position: "absolute",
                                  marginTop: "-17%"
                                }}
                              />{" "}
                              &nbsp;
                              <span
                                style={{
                                  position: "absolute",
                                  marginTop: "-18.5%",
                                  marginLeft: "10px"
                                }}
                              >
                                {TotalVehicle.speed}
                              </span>
                            </List.Item>
                          </List>
                        ))
                      : null}
                  </InfiniteScroll>
                </div>
              </Menu>
            </Sider>
            <Layout>
              <Content>
                <Map
                  id=""
                  className="markercluster-map"
                  zoom={this.state.zoom}
                  minzoom={this.state.minzoom}
                  style={{ width: "100%", height: "700px" }}
                  center={[this.state.c1, this.state.c2]}
                  // zoom ={5}
                >
                  <Tilelayer />
                  {/* <FeatureGroup></FeatureGroup> */}
                  <MarkerClusterGroup>
                    {this.state.positionData.map(positionData =>
                    (
                        <React.Fragment>
                          <RotatedMarker
                            position={[
                              positionData.latitude,
                              positionData.longitude
                            ]}
                            rotationAngle={positionData.course}
                            rotationOrigin={"center"}
                            icon={positionData.speed == 0.0 ? myicon2 : myicon}
                            onClick={() => this.showAttributes(positionData)}
                          ></RotatedMarker>
                       { this.state.enablePolyline == true ?
                       
                       this.state.coords.map(({lat,lng}, index) =>
                       (
                        this.state.coords[index+1] == undefined ?
                       
                             <Polyline
                              color={"red"}
                              positions={[
                                [this.state.coords[index].lat,this.state.coords[index].lng], [this.state.coords[index].lat,this.state.coords[index].lng]
                              ]}
                       
                            ></Polyline>
                            :
                            <Polyline
                              color={"red"}
                              positions={[
                                [this.state.coords[index].lat,this.state.coords[index].lng], [this.state.coords[index+1].lat,this.state.coords[index+1].lng]
                              ]}
                       
                            ></Polyline>
                        )) : null} 
                    }
                          {/* {this.state.tempLat > 0.0 &&
                          this.state.tempLong > 0.0 ? (
                            <Polyline
                              color={"red"}
                              positions={[
                                [this.state.tempLat, this.state.tempLong],
                                [positionData.latitude, positionData.longitude]
                              ]}
                              //  positions={[[22.67825611111111,75.926], [22.86595, 76.2222], [23.9568, 78.2653], [24.00346, 79.956856]]}
                            ></Polyline>
                          ) : null} */}
                          



                          {/*                     
                     <Polyline color={'red'} 
                 positions={[[22.67825611111111,75.926], [22.86595, 76.2222], [23.9568, 78.2653], [24.00346, 79.956856]]}/>  */}
                        </React.Fragment>
                      )
                    )}
                  </MarkerClusterGroup>
                </Map>
              </Content>
            </Layout>
          </Layout>
        </Layout>
        <div>
          {/* <Drawer
            title="Vehicle001"
            placement="right"
            closable={false}
            onClose={this.onClose}
            visible={this.state.visible}
            style={{ marginTop: "40px" }}
          >
            <div>
              <List
                size="large"
                header={
                  <div>
                    <Badge status="processing" text="Running" color="green" />
                  </div>
                }
                dataSource={data1}
                renderItem={item => <List.Item>{item}</List.Item>}
              />
            </div>
          </Drawer> */}
          {this.state.specificdevice.map(specificdevice => (
            <Drawer
              title={specificdevice.name}
              placement="right"
              closable={true}
              onClose={this.onClose}
              visible={this.state.visible}
              style={{ marginTop: "40px" }}
            >
              <div>
            <Badge status="processing" text="Running" color="green" />
            <ul style={{marginLeft:'-50px'}}>
              <li className="list-style"><DashboardOutlined /> Speed:<span className="list-name">{specificdevice.speed}</span></li>
              <li className="list-style"><FieldTimeOutlined /> Time:<span className="list-name">{specificdevice.servertime}</span></li>
              <li className="list-style"><EnvironmentOutlined/> Latitude: <span className="list-name">{specificdevice.latitude}</span></li>
              <li className="list-style"><EnvironmentOutlined/> Logitude: <span className="list-name">{specificdevice.longitude}</span></li>
              <li className="list-style"> <img src={require('../../assets/icons/distance.png')} />  Distance: <span className="list-name">{specificdevice.distance}</span></li>
              <li className="list-style"><img src={require('../../assets/icons/space.png')} /> Total Distance: <span className="list-name">{specificdevice.totalDistance}</span></li>
              <li className="list-style"><img src={require('../../assets/icons/distance.png')} /> Today Distane: <span className="list-name">45km.</span></li>
          
            </ul> 
            </div>
            <NavLink to="/history"> <div style={{ cursor: 'pointer' }}>History&nbsp;<HistoryOutlined /></div></NavLink>
            </Drawer>
          ))}
        </div>
      </div>
    );
  }
}
