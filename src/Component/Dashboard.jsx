

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [todayLeads, setTodayLeads] = useState([]);
  const [todayArogya, setTodayArogya] = useState([]);
  const [todayMessages, setTodayMessages] = useState([]);
  const [hourlyLeads, setHourlyLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const token=localStorage.getItem('token')
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Summary
        const summaryRes = await axios.get('https://ruwa-backend.onrender.com/api/admin/summary',{
          method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(summaryRes.data);

        // Today Leads
        const leadsRes = await axios.get('https://ruwa-backend.onrender.com/api/admin/leads/today',{
          method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        });
        setTodayLeads(leadsRes.data || []);

        // Today Arogya Applications
        const arogyaRes = await axios.get('https://ruwa-backend.onrender.com/api/admin/arogya/today',{
          method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        });
        setTodayArogya(arogyaRes.data || []);

        // Today Contact Messages
        const messagesRes = await axios.get('https://ruwa-backend.onrender.com/api/admin/messages/today',{
          method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        });
        setTodayMessages(messagesRes.data || []);

        // Hourly Leads
        const hourlyRes = await axios.get('https://ruwa-backend.onrender.com/api/admin/leads/todays-leads-hourly',{
          method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        });
        setHourlyLeads(hourlyRes.data || []);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-fluid px-2 px-md-4">
      {/* Summary Cards */}
      <div className="row mt-4">
        <Card title="Total Kendra" value={summary.totalKendra || 0} change="↑ 15.3%" changeColor="bg-success text-white px-2" extra="Kendra Across India" />
        <Card title="Total Employee" value={summary.totalEmployees || 0} change="↑ 9.8%" changeColor="bg-primary text-white px-2" extra="Employees in system" />
        <Card title="Today Leads" value={summary.todayLeads || 0} change="↓ 5.1%" changeColor="bg-warning text-dark px-2" extra="Leads captured today" />
        <Card title="Today Arogya Card" value={summary.todayArogyaUploads || 0} change="↑ 2.7%" changeColor="bg-info text-white px-2" extra="Uploads made today" />
        <Card title="Today Messages" value={summary.todayMessages || 0} change="↑ 1.2%" changeColor="bg-secondary text-white px-2" extra="Messages received today" />
      </div>

      {/* Dual Chart Section */}
      <div className="row my-4">
        {/* Line Chart */}
        <div className="col-12 col-md-6 mb-4">
          <div className="card shadow-sm p-3 h-100">
            <h6 className="text-center mb-3">Today's Leads - Hourly (Line)</h6>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyLeads}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(hour) => {
                      const hr = parseInt(hour, 10);
                      const suffix = hr >= 12 ? 'PM' : 'AM';
                      const formatted =
                        hr === 0 ? '12 AM' :
                        hr === 12 ? '12 PM' :
                        `${(hr % 12).toString().padStart(2, '0')} ${suffix}`;
                      return formatted;
                    }}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#4A90E2" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Leads" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="col-12 col-md-6 mb-4">
          <div className="card shadow-sm p-3 h-100">
            <h6 className="text-center mb-3">Today's Leads - Hourly (Bar)</h6>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyLeads}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(hour) => {
                      const hr = parseInt(hour, 10);
                      const suffix = hr >= 12 ? 'PM' : 'AM';
                      const formatted =
                        hr === 0 ? '12 AM' :
                        hr === 12 ? '12 PM' :
                        `${(hr % 12).toString().padStart(2, '0')} ${suffix}`;
                      return formatted;
                    }}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Leads" fill="#4A90E2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Today Leads Table */}
      <div className="row">
        <div className="col-12">
          <div className="card px-2 px-md-4 py-3 shadow-sm">
            <h5 className="mb-3 text-center text-md-start">Today Leads (JanArogyaApply)</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-sm mb-0">
                <thead className="thead-dark">
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {todayLeads.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">No leads for today.</td>
                    </tr>
                  ) : (
                    todayLeads.map((lead, index) => (
                      <tr key={index}>
                        <td>{lead.name}</td>
                        <td>{lead.phone}</td>
                        <td>{lead.email}</td>
                        <td>{lead.createdAt ? new Date(lead.createdAt).toLocaleString('en-IN', { hour12: true }) : 'N/A'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Today Arogya Applications Table */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card px-2 px-md-4 py-3 shadow-sm">
            <h5 className="mb-3 text-center text-md-start">Today Arogya Applications</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-sm mb-0">
                <thead className="thead-dark">
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayArogya.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">No applications for today.</td>
                    </tr>
                  ) : (
                    todayArogya.map((app, index) => (
                      <tr key={index}>
                        <td>{app.name}</td>
                        <td>{app.mobile}</td>
                        <td>{app.email}</td>
                        <td>{app.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Today Contact Messages Table */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card px-2 px-md-4 py-3 shadow-sm">
            <h5 className="mb-3 text-center text-md-start">Today Contact Messages</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-sm mb-0">
                <thead className="thead-dark">
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {todayMessages.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">No messages for today.</td>
                    </tr>
                  ) : (
                    todayMessages.map((msg, index) => (
                      <tr key={index}>
                        <td>{msg.name}</td>
                        <td>{msg.phone}</td>
                        <td>{msg.email}</td>
                        <td>{msg.message}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;


