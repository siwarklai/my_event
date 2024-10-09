import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "./components/Login/index";
import Main from './components/eventsUser/Main';
import Event from './components/eventsUser/events';
import ShowEvent from './components/eventsUser/ShowEvent';
import CreateEvent from './components/eventsUser/CreateEvent';
import EditEvent from './components/eventsUser/EditEvent';
import DeleteEvent from './components/eventsUser/DeleteEvent';
import ShowUser from './components/userscrud/showuser';
import CreateUser from './components/userscrud/createuser';
import EditUser from './components/userscrud/edituser';
import DeleteUser from './components/userscrud/deleteuser';
import Dashboard from './components/Dashboard/index';
import UserHome from './components/userscrud/home';
import Event from './components/eventAdmin/events';
import ShowEvent from './components/eventAdmin/ShowEvent';
import CreateEvent from './components/eventAdmin/CreateEvent';
import EditEvent from './components/eventAdmin/EditEvent';
import DeleteEvent from './components/eventAdmin/DeleteEvent';
import './App.css';

function App() {
    const user = localStorage.getItem("token");
    const location = useLocation();

    useEffect(() => {
        if (user) {
            localStorage.setItem("lastVisitedPath", location.pathname);
        }
    }, [location, user]);

    const lastVisitedPath = localStorage.getItem("lastVisitedPath") || "/Login";


    return (
        <Routes>
            {user ? (
                <>
                    {/* Event CRUD Routes */}
                    <Route path="/Main" exact element={<Main />} />
                    <Route path="/events" exact element={<Event/>} />
                    <Route path="/events/create" element={<CreateEvent />} />
                    <Route path="/events/details/:id" element={<ShowEvent />} />
                    <Route path="/events/edit/:id" element={<EditEvent />} />
                    <Route path="/events/delete/:id" element={<DeleteEvent />} />
                    
                    {/* Event CRUD Routes Admin */}
                    <Route path="/Main" exact element={<Main />} />
                    <Route path="/events" exact element={<Event/>} />
                    <Route path="/events/create" element={<CreateEvent />} />
                    <Route path="/events/details/:id" element={<ShowEvent />} />
                    <Route path="/events/edit/:id" element={<EditEvent />} />
                    <Route path="/events/delete/:id" element={<DeleteEvent />} />
                    {/* User CRUD Routes */}
                    <Route path="/users/create" element={<CreateUser />} />
                    <Route path="/users/details/:id" element={<ShowUser />} />
                    <Route path="/users/edit/:id" element={<EditUser />} />
                    <Route path="/users/delete/:id" element={<DeleteUser />} />
                    <Route path="/users" element={<UserHome />} />
                    <Route path="/" element={<Navigate replace to={lastVisitedPath} />} />
                </>
            ) : (
                <Route path="/" element={<Navigate replace to="/Login" />} />
            )}

            {/* Common Routes */}
            <Route path="/Login" exact element={<Login />} />
            <Route path="/dashboard" exact element={<Dashboard />} />
        </Routes>
    );
}

export default App;
