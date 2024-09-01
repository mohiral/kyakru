import React, { useState } from 'react';
import { useRoutes } from 'react-router-dom';
import Home from './Admin/Home';
import ChartPage from './Admin/ChartPage';
import ResultDisplay from './Admin/First-page/ResultDisplay';
import DataFirst from './Admin/First-page/DataFirst';
import DataSecond from './Admin/First-page/DataSecond';
import DataThird from './Admin/First-page/DataThird';
import DataFourth from './Admin/First-page/DataFourth';
import Layout from './Admin/Layout';
import FrLayout from './Components/FrLayout';
import HomePage from './Components/HomePage';
import DataFive from './Admin/First-page/DataFive';
import AboutUs from './Components/AboutUs';
import Contact from './Components/Contact';



const App = () => {
    const [data, setData] = useState({ time: '', name: '', result: '' });

    const handleDataSubmit = (newData) => {
        setData(newData);
    };

    // Define routes using useRoutes
    let routes = useRoutes([
        {
            path: "/",
            element: <FrLayout />,
            children: [
                { path: "/", element: <HomePage /> },
                { path: "about", element: <AboutUs /> },
                { path: "contact", element: <Contact /> }
            ]
        },
        {
            path: "/admin/*",
            element: <Layout />,
            children: [
                { path: "home", element: <Home /> },
                { path: "admin", element: <DataFirst onSubmit={handleDataSubmit} /> },
                { path: "admin2", element: <DataSecond onSubmit={handleDataSubmit} /> },
                { path: "admin3", element: <DataThird onSubmit={handleDataSubmit} /> },
                { path: "admin4", element: <DataFourth onSubmit={handleDataSubmit} /> },
                { path: "admin5", element: <DataFive onSubmit={handleDataSubmit} /> },
                { path: "chart", element: <ChartPage /> },
                { path: "result", element: <ResultDisplay {...data} /> }
            ]
        }
    ]);

    return routes;
};

export default App;
