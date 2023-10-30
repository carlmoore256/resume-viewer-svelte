<script>
    import Toast from "./Toast.svelte";
    import {
        errorStore,
        successStore,
    } from "../../lib/stores/notificationStores";
</script>

<Toast color="DarkRed" store={errorStore} timeout={4000} />
<Toast color="DarkGreen" store={successStore} timeout={4000} />
