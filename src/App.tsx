import { useState, useEffect } from 'react';
import './App.css';
import { usePathConversion } from './hooks/usePathConversion';
import { useCopyClipboard } from './hooks/useCopyClipboard';

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
  //TextFieldの初期値
  const initialPath: string = '';

  //usePathConversion呼び出し
  const {
    winPath,
    macPath,
    setWinPath,
    setMacPath,
    convertedWinPath,
    setConvertedWinPath,
    convertedMacPath,
    setConvertedMacPath,
    resultWinText,
    resultMacText,
    convertWindowsPathToMac,
    convertedMacPathToWindows,
  } = usePathConversion({ initialPath });

  //useCopyClipboard呼び出し
  const { checkCopyWinFlag, checkCopyMacFlag, copyToClipboard } = useCopyClipboard();

  //TextFieldに値が入力された際に、変換されたパスを表示するために使用
  const [checkconvertedWinPath, setCheckconvertedWinPath] = useState<boolean>(false);
  const [checkconvertedMacPath, setCheckconvertedMacPath] = useState<boolean>(false);

  // inputフォーム入力
  const setPathInput = (inputPath: string, isWindowsPath: boolean) => {
    //windowsのpathを変換
    if (isWindowsPath) {
      setWinPath(inputPath);
      if (inputPath) {
        setCheckconvertedWinPath(true);
      }
      // text ariaが空の場合はmacのパスも空とする
      if (!inputPath) {
        setMacPath(initialPath);
      }
      //macのpathを変換
    } else {
      setMacPath(inputPath);
      if (inputPath) {
        setCheckconvertedMacPath(true);
      }
      // text ariaが空の場合はwindowsのパスも空とする
      if (!inputPath) {
        setWinPath(initialPath);
      }
    }
  };

  // pathが更新された時にconversionWinPathを呼び出し、パスの変換を行う
  useEffect(() => {
    convertWindowsPathToMac();
  }, [winPath, convertWindowsPathToMac]);

  // pathが更新された時にconversionMacPathを呼び出し、パスの変換を行う
  useEffect(() => {
    convertedMacPathToWindows();
  }, [macPath, convertedMacPathToWindows]);

  // convertedWinPath or convertedMacPathが更新された時にフラグをクリアする
  useEffect(() => {
    if (convertedWinPath) {
      setCheckconvertedWinPath(false);
    }
  }, [convertedWinPath]);

  useEffect(() => {
    if (convertedMacPath) {
      setCheckconvertedMacPath(false);
    }
  }, [convertedMacPath]);

  //クリアボタン押下時に、テキストエリアと変換された値をクリアする
  const clearPath = () => {
    //パスの初期化
    setWinPath(initialPath);
    setMacPath(initialPath);
    setConvertedWinPath(initialPath);
    setConvertedMacPath(initialPath);
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
            value={checkconvertedWinPath ? winPath : convertedWinPath}
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
            value={checkconvertedMacPath ? macPath : convertedMacPath}
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
