<script>
    import '../app.css'
</script>
<nav>
	<a href="/">Home</a>
    <a href="/about">About</a>
</nav>

<slot />

<footer>
    <a rel="external" href="https://www.yooksel.com/">@yooksel</a>
</footer>

<style>
    nav {
        display: flex;
        justify-content: space-between;
    }

    footer {
        position: absolute;
        left: 50%;
        bottom: 0;
    }
</style>