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
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import GitHubIcon from '@mui/icons-material/GitHub';

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
  } = usePathConversion({ initialPath });

  //useCopyClipboard呼び出し
  const { checkCopyWinFlag, checkCopyMacFlag, copyToClipboard } = useCopyClipboard();

  //TextFieldに値が入力された際に、変換されたパスを表示するために使用
  const [checkConvertedWinPath, setCheckConvertedWinPath] = useState<boolean>(false);
  const [checkConvertedMacPath, setCheckConvertedMacPath] = useState<boolean>(false);

  // inputフォーム入力
  const setPathInput = (inputPath: string, isWindowsPath: boolean) => {
    //windowsのpathを変換
    if (isWindowsPath) {
      setWinPath(inputPath);
      if (inputPath) {
        setCheckConvertedWinPath(true);
      }
      // text ariaが空の場合はmacのパスも空とする
      if (!inputPath) {
        setMacPath(initialPath);
      }
      //macのpathを変換
    } else {
      setMacPath(inputPath);
      if (inputPath) {
        setCheckConvertedMacPath(true);
      }
      // text ariaが空の場合はwindowsのパスも空とする
      if (!inputPath) {
        setWinPath(initialPath);
      }
    }
  };

  // convertedWinPath or convertedMacPathが更新された時にフラグをクリアする
  useEffect(() => {
    if (convertedWinPath) {
      setCheckConvertedWinPath(false);
    }
  }, [convertedWinPath]);

  useEffect(() => {
    if (convertedMacPath) {
      setCheckConvertedMacPath(false);
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
    <>
      {checkCopyWinFlag || checkCopyMacFlag ? (
        <Stack
          sx={{ width: '50%', position: 'fixed', top: '5%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 'tooltip' }}
          spacing={2}
          position="fixed"
        >
          <Alert severity="success" variant="filled">
            コピーが成功しました！
          </Alert>
        </Stack>
      ) : (
        <></>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky" color="transparent">
          <Toolbar>
            <LaptopMacIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ファイルパス変換
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="Open GitHub">
              <IconButton sx={{ p: 0 }} href="https://github.com/powerninja/cross_path">
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </Box>
      <Box sx={{ mt: 4 }}>
        <div
          style={{
            height: 'auto',
            margin: '0 auto',
            maxWidth: 1000,
            width: '100%',
          }}
        >
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
                value={checkConvertedWinPath ? winPath : convertedWinPath}
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
                value={checkConvertedMacPath ? macPath : convertedMacPath}
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
      </Box>
    </>
  );
};
