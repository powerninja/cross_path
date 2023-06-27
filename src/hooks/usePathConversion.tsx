import { useState, useEffect } from 'react';

type Props = {
  initialPath: string;
};

export const usePathConversion = ({ initialPath }: Props) => {
  //パスの設定
  const [winPath, setWinPath] = useState<string>(initialPath);
  const [macPath, setMacPath] = useState<string>(initialPath);

  //変換後のパスを保存
  const [convertedWinPath, setConvertedWinPath] = useState<string>(initialPath);
  const [convertedMacPath, setConvertedMacPath] = useState<string>(initialPath);

  //コピーペースト機能で使用(Windows)
  const [resultWinText, setResultWinText] = useState<string>(initialPath);

  //コピーペースト機能で使用(Mac)
  const [resultMacText, setResultMacText] = useState<string>(initialPath);

  // pathが更新された時にconversionWinPathを呼び出し、パスの変換を行う
  useEffect(() => {
    //windowsのpathを変換
    if (winPath) {
      let macPaths = winPath.replace(/\\/g, '/').replace(/192.168.254.6/g, 'Volumes');
      //windows側のtextに入力された文字が2文字以上だった場合、パスの変換前に不要なスラッシュを削除する
      if (winPath.length !== 1) {
        //winPathの先頭の文字がスラッシュだった場合、スラッシュを削除する
        if (winPath[0] === '\\') {
          macPaths = macPaths.slice(1); //先頭の文字を削除
        }
      }
      setConvertedMacPath(macPaths);
      setResultMacText(macPaths);
    } else {
      setConvertedMacPath(initialPath);
      setResultMacText(initialPath);
    }
  }, [winPath, setConvertedMacPath, setResultMacText, initialPath]);

  // pathが更新された時にconversionMacPathを呼び出し、パスの変換を行う
  useEffect(() => {
    //macのpathを変換
    if (macPath) {
      //パスの変換前に不要なバックスラッシュを削除する
      const replaceBackSlash = macPath.replace(/\\/g, '');
      //macのpathを変換
      const normalizWinPath = `\\${replaceBackSlash.replace(/\//g, '\\').replace(/Volumes/g, '192.168.254.6')}`;
      //文字コードをUTF8-mac(NFD)からUTF8(NFC)に変換する
      const winPaths = normalizWinPath.normalize('NFC');
      setConvertedWinPath(winPaths);
      setResultWinText(winPaths);
    } else {
      setConvertedWinPath(initialPath);
      setResultWinText(initialPath);
    }
  }, [macPath, setConvertedWinPath, setResultWinText, initialPath]);

  return {
    winPath,
    macPath,
    setWinPath,
    setMacPath,
    convertedWinPath,
    setConvertedWinPath,
    convertedMacPath,
    setConvertedMacPath,
    resultWinText,
    setResultWinText,
    resultMacText,
    setResultMacText,
  };
};
