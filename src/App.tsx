import React, {ChangeEvent, useEffect, useState} from 'react';
import {v1} from 'uuid';
import s from './App.module.css';
import {
    Box,
    Button,
    createTheme, Grid, Input,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    ThemeProvider, Typography
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import BasicModal from "./BasicModal";
import {Affair} from "./Affair";
import {ChangeItemForm} from "./ChangeItemForm";

export type AffairType = {
    id: string
    name: string
    counter: number
    isDone: boolean
}
export type AffairsType = {
    [key: string]: Array<AffairType>
}

function App() {
    let [chosenAffairs, setChosenAffairs] = useState<string>('Activities');
    let [affairs, setAffairs] = useState<AffairsType>({
            ['Activities']: [
                {
                    id: v1(),
                    name: 'Fairytale',
                    counter: 0,
                    isDone: false,
                },
                {
                    id: v1(),
                    name: 'One piece',
                    counter: 0,
                    isDone: false,
                },
            ],
            ['Code']: [
                {
                    id: v1(),
                    name: 'Путь самурая',
                    counter: 0,
                    isDone: false,
                },
                {
                    id: v1(),
                    name: 'Todolist',
                    counter: 0,
                    isDone: false,
                },
            ],
        }
    );
    useEffect(() => {
        let valueAsString = localStorage.getItem('affairs');
        if (valueAsString) {
            let result = JSON.parse(valueAsString);
            setAffairs(result);
        }
    }, [])
    useEffect(() => {
        setToLocaleStorage();
    }, [affairs])
    const setToLocaleStorage = () => {
        localStorage.setItem('affairs', JSON.stringify(affairs));
    }
    let [inputAffairValue, setInputAffairValue] = useState<string>('');
    let [error, setError] = useState<string | null>(null);
    let [result, setResult] = useState<AffairType | null>(null);
    let [funny, setFunny] = useState<number | null>(null);
    const addNew = () => {
        if (inputAffairValue.trim() !== '') {
            setAffairs({...affairs,
                [chosenAffairs]: [{
                id: v1(),
                name: inputAffairValue,
                counter: 0,
                isDone: false
            }, ...affairs[chosenAffairs]]});
            setInputAffairValue('');
            setToLocaleStorage();
            setFunny(null);
            setResult(null);
        } else {
            setError('Заполни все поля');
        }
    }
    const onChangeAffairHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setInputAffairValue(e.currentTarget.value);
    }
    const removeItem = (id: string) => {
        setAffairs({...affairs, [chosenAffairs]: affairs[chosenAffairs].filter(el => el.id !== id)});
    }
    const onChangeItemStatus = (id: string, isDone: boolean) => {
        let item = affairs[chosenAffairs].find((el) => el.id === id);
        if (item) {
            let newItem = {...item, isDone};
            if (isDone) {
                setAffairs({...affairs, [chosenAffairs]: [...affairs[chosenAffairs].filter(el => el.id !== id), newItem]});
            } else {
                setAffairs({...affairs, [chosenAffairs]: [newItem, ...affairs[chosenAffairs].filter(el => el.id !== id)]});
            }
        }
    }
    const randomizer = () => {
        let length = affairs[chosenAffairs].filter(el => !el.isDone).length;
        let pos: number;
        const interval = setInterval(() => {
            pos = Math.floor(Math.random() * length);
            setFunny(pos);
        }, 200);
        setTimeout(() => {
            clearInterval(interval);
            if (pos >= 0) {
                setAffairs({...affairs, [chosenAffairs]: affairs[chosenAffairs].map((el, i) => i === pos ? {...el, counter: el.counter + 1} : el)});
                setResult(affairs[chosenAffairs][pos]);
            }
        }, 5000);
    }
    const exportData = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(affairs)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "data.json";
        link.click();
    };
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        if (e.target.files) {
            fileReader.readAsText(e.target.files[0], "UTF-8");
        }
        fileReader.onload = e => {
            if (e.target) {
                if (typeof e.target.result === "string") {
                    console.log("e.target.result", JSON.parse(e.target.result));
                    setAffairs({...JSON.parse(e.target.result)});
                    setToLocaleStorage();
                }
            }
        };
    };
    const changeAffairs = (title: string) => {
        setChosenAffairs(title);
        setFunny(null);
        setResult(null);
    }
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Box sx={{flexGrow: 1}}>
                <Grid container spacing={2} sx={{
                    padding: '8px',
                }}>
                    {affairs[chosenAffairs].map((el, i) => {
                        return <Affair
                            key={el.id}
                            affair={el}
                            removeItem={removeItem}
                            index={i}
                            onChangeItemStatus={onChangeItemStatus}
                            funny={funny}
                        />
                    })}
                </Grid>
                <div className={s.container}>
                    <TextField
                        error={error ? true : false}
                        id="standard-basic"
                        label="Activity"
                        variant="standard"
                        value={inputAffairValue}
                        onChange={onChangeAffairHandler}
                        helperText={error}
                        fullWidth
                    />
                    <Button onClick={() => addNew()}>
                        Добавить
                    </Button>
                </div>
                <Paper style={{
                    width: '300px',
                    margin: '10px auto'
                }} elevation={5}>
                    <div className={s.container}>
                        <Button onClick={randomizer}>Хоть бы вовка</Button>
                        {result
                            ? <List>
                                <ListItem key={result.id}>
                                    <ListItemText primary={result.name}></ListItemText>
                                </ListItem>
                            </List>
                            : 'Результат'
                        }
                    </div>
                </Paper>
                <ChangeItemForm
                    changeAffairs={changeAffairs}
                />
            </Box>
            <BasicModal>
                <div className={s.container}>
                    <Button onClick={exportData}>
                        Export Data
                    </Button>
                    <Input type="file" name="f" onChange={handleChange}/>
                </div>
            </BasicModal>
        </ThemeProvider>
    )
}

export default App;