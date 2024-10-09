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


import Evadmin from './components/eventsAdmin/event';
import Showevent from './components/eventsAdmin/show';
import Createevent from './components/eventsAdmin/create';
import Editevent from './components/eventsAdmin/edit';
import Deleteevent from './components/eventsAdmin/delete';
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
                    {/* Event CRUD Routes user */}
                    <Route path="/user/Main" exact element={<Main />} />
                    <Route path="/user/events" exact element={<Event/>} />
                    <Route path="/user/events/create" element={<CreateEvent />} />
                    <Route path="/user/events/details/:id" element={<ShowEvent />} />
                    <Route path="/user/events/edit/:id" element={<EditEvent />} />
                    <Route path="/user/events/delete/:id" element={<DeleteEvent />} />
                    
                    {/* Event CRUD Routes Admin */}
                    
                    <Route path="/admin/event" exact element={<Evadmin/>} />
                    <Route path="/admin/event/create" element={<Createevent />} />
                    <Route path="/admin/event/details/:id" element={<Showevent />} />
                    <Route path="/admin/event/edit/:id" element={<Editevent />} />
                    <Route path="/admin/event/delete/:id" element={<Deleteevent />} />
                    {/* User CRUD Routes */}
                    <Route path="/admin/user/create" element={<CreateUser />} />
                    <Route path="/admin/user/details/:id" element={<ShowUser />} />
                    <Route path="/admin/user/edit/:id" element={<EditUser />} />
                    <Route path="/admin/user/delete/:id" element={<DeleteUser />} />
                    <Route path="/admin" element={<UserHome />} />
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
