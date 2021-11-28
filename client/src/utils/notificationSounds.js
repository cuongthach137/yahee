export const playSound = (type, sound) => {
  const list = {
    boom: "https://www.myinstants.com/media/sounds/vine-boom.mp3",
    bruh: "https://www.myinstants.com/media/sounds/movie_1.mp3",
    fbi: "https://www.myinstants.com/media/sounds/fbi-open-up_dwLhIFf.mp3",
    piupiu: "/sounds/piupiu.mp3",
    grow: "https://cdn.fbsbx.com/v/t59.3654-21/253560320_605880787114465_5046334062042002010_n.mp4/audioclip-1636391727000-2848.mp4?_nc_cat=105&ccb=1-5&_nc_sid=7272a8&_nc_ohc=00QHiIDI6J8AX-NWpm0&_nc_ht=cdn.fbsbx.com&oh=f9fc223f8747c07197f56dcd2f024c45&oe=618ACE99&dl=1",
    cancel: "/sounds/piupiu.mp3",
    typing: "/sounds/typing.mp3",
    sendMessage: "/sounds/sendMessage.ogg",
    newMessage: "/sounds/newMessage.mp3",
    emojiSelection: "/sounds/selection.mp3",
  };

  const audio = new Audio(list[type]);

  if (sound) {
    audio.play();
  }

  return audio;
};
