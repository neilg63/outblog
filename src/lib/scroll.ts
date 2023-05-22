export const getScrollTopPos = () => {
  console.log(window.scrollY);
  if (window) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 48) {
        document.body.classList.add("scrolled-down");
      } else {
        document.body.classList.remove("scrolled-down");
      }
    });
  }
};
