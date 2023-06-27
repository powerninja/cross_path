import { useState, useEffect, useCallback } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import CheckIcon from '@mui/icons-material/Check';

export const App = () => {
  //パスの設定
  const [winPath, setWinPath] = useState<string>('');
  const [macPath, setMacPath] = useState<string>('');

  //変換後のパスを保存
  const [convertWinPath, setConvertWinPath] = useState<string>('');
  const [convertMacPath, setConvertMacPath] = useState<string>('');

  //text ariaに値が入力された際はtrueとするフラグ
  const [checkConvertWinPath, setCheckConvertWinPath] = useState<boolean>(false);
  const [checkConvertMacPath, setCheckConvertMacPath] = useState<boolean>(false);

  //コピーペースト機能で使用(Windows)
  const [resultWinText, setResultWinText] = useState<string>('');

  //コピーペースト機能で使用(Mac)
  const [resultMacText, setResultMacText] = useState<string>('');

  //コピーボタンを押下した際にチェックアイコンを表示する
  const [checkCopyWinFlag, setCheckCopyWinFlag] = useState<boolean>(false);
  const [checkCopyMacFlag, setCheckCopyMacFlag] = useState<boolean>(false);

  // inputフォーム入力
  const setPathInput = (inputPath: string, isWindowsPath: boolean) => {
    if (isWindowsPath) {
      setWinPath(inputPath);
      if (inputPath) {
        setCheckConvertWinPath(true);
      }

      // text ariaが空の場合はmacのパスも空とする
      if (!inputPath) {
        setMacPath('');
      }
    } else {
      setMacPath(inputPath);
      if (inputPath) {
        setCheckConvertMacPath(true);
      }

      // text ariaが空の場合はwindowsのパスも空とする
      if (!inputPath) {
        setWinPath('');
      }
    }
  };

  //変換ボタン押下時に、Pathの変換処理を実行する
  const convertWindowsPathToMac = useCallback(() => {
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
      setConvertMacPath(macPaths);
      setResultMacText(macPaths);
    } else {
      setConvertMacPath('');
      setResultMacText('');
    }
  }, [winPath]);

  const convertMacPathToWindows = useCallback(() => {
    //windowsのpathを変換
    if (macPath) {
      //パスの変換前に不要なバックスラッシュを削除する
      const replaceBackSlash = macPath.replace(/\\/g, '');
      //macのpathを変換
      const normalizWinPath = `\\${replaceBackSlash.replace(/\//g, '\\').replace(/Volumes/g, '192.168.254.6')}`;
      //文字コードをUTF8-mac(NFD)からUTF8(NFC)に変換する
      const winPaths = normalizWinPath.normalize('NFC');
      setConvertWinPath(winPaths);
      setResultWinText(winPaths);
    } else {
      setConvertWinPath('');
      setResultWinText('');
    }
  }, [macPath]);

  // pathが更新された時にconversionWinPathを呼び出し、パスの変換を行う
  useEffect(() => {
    convertWindowsPathToMac();
  }, [winPath, convertWindowsPathToMac]);

  // pathが更新された時にconversionMacPathを呼び出し、パスの変換を行う
  useEffect(() => {
    convertMacPathToWindows();
  }, [macPath, convertMacPathToWindows]);

  // convertWinPath or convertMacPathが更新された時にフラグをクリアする
  useEffect(() => {
    if (convertWinPath) {
      setCheckConvertWinPath(false);
    }
  }, [convertWinPath]);

  useEffect(() => {
    if (convertMacPath) {
      setCheckConvertMacPath(false);
    }
  }, [convertMacPath]);

  //クリアボタン押下時に、テキストエリアと変換された値をクリアする
  const clearPath = () => {
    //パスの初期化
    setWinPath('');
    setMacPath('');
    setConvertWinPath('');
    setConvertMacPath('');
  };

  //クリップボードにコピー関数
  const copyToClipboard = async (alteredText: string, osCheck: boolean) => {
    await global.navigator.clipboard.writeText(alteredText);
    if (osCheck) {
      setCheckCopyWinFlag(true);
      setTimeout(() => {
        setCheckCopyWinFlag(false);
      }, 1000);
    } else {
      setCheckCopyMacFlag(true);
      setTimeout(() => {
        setCheckCopyMacFlag(false);
      }, 1000);
    }
  };

  return (
    <div
      style={{
        height: 'auto',
        margin: '0 auto',
        maxWidth: 1000,
        width: '100%',
      }}
    >
      <Typography variant="h4" gutterBottom>
        ファイルパス変換
      </Typography>
      {/* <h1>ファイルパス変換</h1> */}
      <div className="d-flex flex-row justify-content-around">
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '40ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-multiline-static"
            label="Windows Path"
            multiline
            rows={8}
            value={checkConvertWinPath ? winPath : convertWinPath}
            onChange={(event) => {
              setPathInput(event.target.value, true);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Copy to Clipboard" placement="top" arrow>
                    <IconButton color="primary" size="small" onClick={() => copyToClipboard(resultWinText, true)}>
                      {checkCopyWinFlag ? <CheckIcon></CheckIcon> : <ContentCopyIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            id="outlined-multiline-static"
            label="Mac Path"
            multiline
            rows={8}
            value={checkConvertMacPath ? macPath : convertMacPath}
            onChange={(event) => {
              setPathInput(event.target.value, false);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Copy to Clipboard" placement="top" arrow>
                    <IconButton color="primary" size="small" onClick={() => copyToClipboard(resultMacText, false)}>
                      {checkCopyMacFlag ? <CheckIcon></CheckIcon> : <ContentCopyIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          <div className="button-container">
            <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => clearPath()}>
              クリア
            </Button>
          </div>
        </Box>
      </div>
    </div>
  );
};
