module.exports = {
  formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;
    return `${!hours ? "" : hours}${!hours ? "" : ":"}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  },

  generateProgressBar(position, duration, size = 20) {
    const progress = Math.floor((position / duration) * size);
    const bar = "▬".repeat(size);
    return bar.substring(0, progress) + "🔘" + bar.substring(progress + 1);
  },
  
  trimLyrics(text) {
    const index = text.indexOf('[');
    if (index !== -1) {
      return text.substring(index);
    }
    return text;
  }
}