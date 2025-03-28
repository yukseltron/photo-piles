<script>
    import '../app.css'
</script>
<nav>
	<a href="/">Photos</a>
    <a href="/about">About</a>
</nav>

<slot />

<style>
    nav {
        width: 100%;;
        display: flex;
        justify-content: space-between;
        font-size: 1.5rem;
    }
</style>