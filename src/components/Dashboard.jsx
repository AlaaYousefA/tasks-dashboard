import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Switch,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  LineChart,
  Line,
} from "recharts";
import dumpData from "../data/dumpData";
import "@fontsource/poppins";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4567",
];

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    typography: {
      fontFamily: "Poppins, sans-serif",
    },
  });

  const completedTasks = dumpData.filter((task) => task.status).length;
  const uncompletedTasks = dumpData.length - completedTasks;
  const completionPercentage = (completedTasks / dumpData.length) * 100;
  const uncompletionPercentage = 100 - completionPercentage;

  const latestAchievement = dumpData.length
    ? dumpData[0].milestone
    : "No achievements yet";
  const mostPriorityTask = dumpData.sort((a, b) =>
    a.priority > b.priority ? -1 : 1
  )[0];

  const projectCount = dumpData.reduce((acc, task) => {
    acc[task.project] = (acc[task.project] || 0) + 1;
    return acc;
  }, {});

  const projectData = Object.keys(projectCount).map((key) => ({
    name: key,
    value: projectCount[key],
  }));

  const upcomingTasks = dumpData
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const productivityTrend = dumpData.map((task, index) => ({
    day: `Day ${index + 1}`,
    tasks: task.actualTimeSpent,
  }));

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          p: 3,
          bgcolor: "background.default",
          color: "text.primary",
          minHeight: "100vh",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />{" "}
        Dark Mode
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ p: 2, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Completed vs Uncompleted Tasks
                </Typography>
                <PieChart width={300} height={300}>
                  <Pie
                    data={[
                      { name: "Completed", value: completedTasks },
                      { name: "Uncompleted", value: uncompletedTasks },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    label
                  >
                    <Cell fill="#4CAF50" />
                    <Cell fill="#F44336" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ p: 2, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Latest Achievement
                </Typography>
                <Typography variant="body1">{latestAchievement}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ p: 2, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming Tasks
                </Typography>
                {upcomingTasks.map((task) => (
                  <Typography key={task.id} variant="body2">
                    {task.name} - Due:{" "}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ p: 2, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Productivity Trend
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={productivityTrend}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="tasks" stroke="#0088FE" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3} sx={{ p: 2, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Projects Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectData}
                      dataKey="value"
                      nameKey="name"
                      label
                    >
                      {projectData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
