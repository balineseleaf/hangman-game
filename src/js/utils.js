export const darkModeHandler = () => {
    const darkModeSwitcher = document.getElementById('toggleDarkMode');
    const htmlElement = document.documentElement;

    if (localStorage.getItem('mode') === 'dark') { // если пользователь впервые вошел на сайт, то localStorage не успел еще ничего сохранить, и 
        // там будет null и проверка null==='dark' будет false, и тогда блок if  не выполнится
        htmlElement.classList.add('dark');
        darkModeSwitcher.checked = true; // чтобы наш свитчер не слетал после обновления страницы
    }

    darkModeSwitcher.addEventListener('input', () => { // при любом изменении value в input , а в наше случае просто клик по чекбоксу
        htmlElement.classList.toggle('dark');

        if (htmlElement.classList.contains('dark')) {
            localStorage.setItem('mode', 'dark')
        } else {
            localStorage.setItem('mode', 'light')
        }
    });
}