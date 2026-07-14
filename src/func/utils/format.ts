// import axios from "axios";
// import https from "https";

export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;
  
  return `${!hours ? "" : hours}${!hours ? "" : ":"}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const generateProgressBar = (position: number, duration: number, size: number = 20): string => {
  const progress = Math.floor((position / duration) * size);
  const bar = "▬".repeat(size);
  return bar.substring(0, progress) + "🔘" + bar.substring(progress + 1);
};

export const trimLyrics = (text: string): string => {
  const index = text.indexOf('[');
  if (index !== -1) {
    return text.substring(index);
  }
  return text;
};

export const debugArgsParser = (): string | null => {
  const args = process.argv.slice(2);
  const debugArg = args.find(arg => arg.startsWith('--debug='));

  if (debugArg) {
    const debugValue = debugArg.split('=')[1];
    if (["player", "client", "all"].includes(debugValue)) {
      return debugValue;
    } else {
      console.warn(`INFO :: ⚠️  Unknown debug value: ${debugValue}`);
    }
  }

  return null;
};

export const configArgsParser = (): any => {
  const args = process.argv.slice(2);
  const envArg = args.find(arg => arg.startsWith('--env='));

  if (envArg) {
    const envValue = envArg.split('=')[1];
    if (["dev", "development", "devs", "d"].includes(envValue)) {
      return require("../../../config/config.test.jsonc");
    } else if (["prod", "p", "production"].includes(envValue)) {
      return require("../../../config/config.jsonc");
    } else {
      console.warn(`INFO :: ⚠️  Unknown config value: ${envValue}`);
    }
  }

  return require("../../../config/config.jsonc");
};