<script>
    import '../app.css'
</script>
<nav>
	<a href="/">Home</a>
	<a href="/photos">Photos</a>
    <a href="/about">About</a>
</nav>

<slot />

<style>
    nav {
        display: flex;
        justify-content: space-between;
    }

    .content {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>