<script>
    import '../app.css'
</script>
<nav>
	<a href="/">Photo Piles</a>
    <a href="/about" style="font-size: 1rem;">About</a>
</nav>

<slot />

<style>
    nav {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }
</style>
