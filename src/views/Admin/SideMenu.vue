<template>
    <div class="container-fluid mt-2">
        <div class="row flex-nowrap">
            <div class="col-auto col-md-3 card shadow col-xl-2 px-sm-2 px-0 bg-dark">
                <div
                    class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 mt-5 text-white min-vh-100">
                    <router-link to="/dashboard"
                        class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <span class="fs-5 d-none d-sm-inline">Menu</span>
                    </router-link>
                    <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                        <li class="nav-item">
                            <router-link to="/dashboard" class="nav-link align-middle px-0">
                                <i class="bi bi-layers-fill"></i> <span class="ms-1 d-none d-sm-inline">Dashboard</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/dashboard/add" class="nav-link px-0 align-middle">
                                <i class="bi bi-plus-circle"></i> <span class="ms-1 d-none d-sm-inline">Add animal</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/dashboard/animals" class="nav-link px-0 align-middle">
                                <i class="bi bi-diagram-3-fill"></i> <span class="ms-1 d-none d-sm-inline">Animals</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/dashboard/customers" class="nav-link px-0 align-middle">
                                <i class="fs-4 bi-people"></i> <span class="ms-1 d-none d-sm-inline">messages</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/dashboard/customers" class="nav-link px-0 align-middle">
                                <i class="fs-4 bi-people"></i> <span class="ms-1 d-none d-sm-inline">New messages</span>
                            </router-link>
                        </li>
                    </ul>
                    <hr>
                    <div class="dropdown pb-2">
                        <router-link to="#"
                            class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                            id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="https://github.com/mdo.png" alt="hugenerd" width="30" height="30"
                                class="rounded-circle">
                            <span class="d-none d-sm-inline mx-1">user</span>
                        </router-link>
                        <ul class="dropdown-menu dropdown-menu-dark text-small shadow">
                            <!-- <li><router-link class="dropdown-item" to="#">New project...</router-link></li>
                            <li><router-link class="dropdown-item" to="#">Settings</router-link></li>-->
                            <li><router-link class="dropdown-item" to="#">Profile</router-link></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <div>
                            </div>
                            <!-- <li><router-link class="dropdown-item" to="#">Sign out</router-link></li> -->
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col card shadow border-primary mt-5 py-3 min-vh-100">
                <!-- <DashBoard /> -->
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>

</script>
<style>

</style>