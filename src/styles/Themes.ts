interface ThemeColors {
  primary: string;
  secondary: string;
  logoname: string;
  text: string;
  mvpCard: {
    name: string;
    bg: string;
    text: string;
    killButton: string;
    editButton: string;
    sumMvpBtn: string;
    controls: {
      showMap: string;
      edit: string;
      delete: string;
    };
  };
  timers: {
    passed: string;
    normal: string;
    respawning: string;
  };
  switch: {
    bg: string;
    handle: string;
  };
  modal: {
    bg: string;
    text: string;
    hl: string;
    name: string;
    time: string;
    button: string;
  };
  filterSearch: {
    bg: string;
    border: string;
    text: string;
  };
  languagePicker: {
    bg: string;
    border: string;
    text: string;
  };
  footer: {
    text: string;
    link: string;
  };
}

interface ThemeItem {
  id: string;
  colors: ThemeColors;
}

interface Themes {
  dark: ThemeItem;
  light: ThemeItem;
}

export const Theme: Themes = {
  dark: {
    id: "dark",

    colors: {
      primary: "#1B1C1D",
      secondary: "#2e2e2e",

      logoname: "#fff",
      text: "#FFFFFF",

      mvpCard: {
        name: "#fff",
        bg: "#262626",
        text: "#fff",
        killButton: "#D10000",
        editButton: "#f89200",
        sumMvpBtn: "#f89200",

        controls: {
          showMap: "#00a8ff",
          edit: "#f89200",
          delete: "#D10000",
        },
      },

      timers: {
        passed: "#D10000",
        normal: "#fff",
        respawning: "#62831f",
      },

      switch: {
        bg: "#FFFFFF",
        handle: "#000000",
      },

      modal: {
        bg: "#262626",
        text: "#fff",
        hl: "#fff",
        name: "#f89200",
        time: "#f89200",
        button: "#f89200",
      },

      filterSearch: {
        bg: "#262626",
        border: "#1b1c1d",
        text: "#fff",
      },

      languagePicker: {
        bg: "#454545",
        border: "#1b1c1d",
        text: "#fff",
      },

      footer: {
        text: "#fff",
        link: "#f89200",
      },
    },
  },

  light: {
    id: "light",

    colors: {
      primary: "#f89200",
      secondary: "#F6F8FA",

      logoname: "#fff",
      text: "#000000",

      mvpCard: {
        name: "#f89200",
        bg: "#FFFFFF",
        text: "#421411",
        killButton: "#D10000",
        editButton: "#f89200",
        sumMvpBtn: "#f89200", // Agrega la propiedad 'sumMvpBtn' aquí

        controls: {
          showMap: "#00a8ff",
          edit: "#f89200",
          delete: "#D10000",
        },
      },

      timers: {
        passed: "#D10000",
        normal: "#421411",
        respawning: "#62831f",
      },

      switch: {
        bg: "#ffa800",
        handle: "#F6F8FA",
      },

      modal: {
        bg: "#FFFFFF",
        text: "#421411",
        hl: "#1b1c1d",
        name: "#ffa800",
        time: "#ffa800",
        button: "#f89200",
      },

      filterSearch: {
        bg: "#FFFFFF",
        border: "#f89200",
        text: "#000",
      },

      languagePicker: {
        bg: "#F6F8FA",
        border: "#f89200",
        text: "#421411",
      },

      footer: {
        text: "#000",
        link: "#53338D",
      },
    },
  },
};
