export const loadState = (sliceName: string) => {
    try {
      const serialState = localStorage.getItem('appState');
      if (serialState === null) {
        return undefined;
      }
      let retData = JSON.parse(serialState);
      if (retData[sliceName]){
        return retData[sliceName];
      }else {
        return {};
      }
    } catch (err) {
      return undefined;
    }
}; 

export const saveState = (state: any) => {
    try {
      const serialState = JSON.stringify(state);
      localStorage.setItem('appState', serialState);
    } catch(err) {
        console.log(err);
    }
};

