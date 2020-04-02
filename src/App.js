import React from 'react';
import './App.css';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import data from './questions.json';
import LinearProgress from '@material-ui/core/LinearProgress';
import Radio from '@material-ui/core/Radio';

/*
 * pre process the data, shuffle the options
 */
data.forEach(element => {
  let options = [
    element.correct_answer,
    ...element.incorrect_answers
  ]
  options = shuffle(options)
  element.options    = options
})

const useStyles = makeStyles(theme => ({
  root: {
    margin : theme.spacing(8), 
    width : 600,
    height : 800,
    elevation : 3,
  },
  main : {
    padding : theme.spacing(8),
    height : '100%',
  },
  score : {
    width : '100%',
  },
  progress : {
    height : 10,
  },
  button : {
    margin : 5,
    minWidth : 200,
    
  },
  result : {
    display : 'flex',
    flexDirection : 'column',
    padding : 51,
  }
}));

/*
 * The component for score
 * the props:
 * answered:have answered how many
 * total:total questions
 * correct: correct answers by now
 */
function Score(props){
  const score = props.answered === 0? 
    0
  :
    Math.round(props.correct * 100 / props.answered);
  const minScore = Math.round(props.correct * 100 / props.total);
  const maxScore = 
    Math.round(
      (props.correct + (props.total - props.answered)) * 100 / props.total
    );

  return (
    <div>
      <div 
        style={{
          display : 'flex',
          justifyContent : 'space-between',
        }}
      >
        <div style={{}}>
          Score: {score + '%'}
        </div>
        <div>
          Max Score: {maxScore + '%'}
        </div>
      </div>
      <div
        style={{
          height : 35,
          width : '100%',
          borderRadius : 8,
          border : '2px solid black',
          position : 'relative',
        }}
      >
        <div
          style={{
            backgroundColor : 'lightgray',
            width : maxScore + '%',
            height : 35,
            borderRadius : 5,
            transition : 'all .5s',
            position : 'absolute',
          }}
        >
        </div>
        <div
          style={{
            backgroundColor : 'gray',
            width : score + '%',
            height : 35,
            borderRadius : 5,
            transition : 'all .5s',
            position : 'absolute',
          }}
        >
        </div>
        <div
          style={{
            backgroundColor : 'black',
            width : minScore + '%',
            height : 35,
            borderRadius : 5,
            transition : 'all .5s',
            position : 'absolute',
          }}
        >
        </div>
      </div>
    </div>
  )
}


function App () {
  const classes = useStyles();
  //current question index
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  //if current question has been answered
  const [answered, setAnswered] = React.useState(false);
  //the total correct answers
  const [correctTotal, setCorrectTotal] = React.useState(0);
  //answer of current user
  const [answer, setAnswer] = React.useState(-1);

  const options   = data[currentQuestion].options

  function choose(index){
    setAnswer(index)
    if(options[index] ===  data[currentQuestion].correct_answer){
      setCorrectTotal(correctTotal + 1);
    }
    setAnswered(true)
  }

  /*
   * answer question who's type is boolean
   */
  function chooseBoolean(answer){
    setAnswer(answer)
    if(data[currentQuestion].correct_answer === answer){
      setCorrectTotal(correctTotal + 1);
    }
    setAnswered(true)
  }

  function next(){
    setAnswered(false)
    setAnswer(-1)
    setCurrentQuestion(currentQuestion + 1);
  }

  return (
    <div>
      <Paper elevation={3} className={classes.root} >
        <LinearProgress 
          className={classes.progress}
          variant="determinate" 
          value={currentQuestion * 100 / data.length} />
        <Grid 
          className={classes.main}
          direction="column"
          justify="space-between"
          alignItems="flex-end"
          container
        >
          <Grid item>
            <Typography variant="h5">
              Question {currentQuestion} of {data.length}
            </Typography>
            <Typography variant="body2"> 
              {decode(data[currentQuestion].category)}
            </Typography>
            <Rating 
              name="read-only" 
              max={3} 
              readOnly 
              value={['easy', 'medium', 'hard'].reduce(
                (a,c,i) => c === data[currentQuestion].difficulty? i+1 : a, 
                'undefined'
              )} 
            />
            <Typography component="p">
              {decode(data[currentQuestion].question)}
            </Typography>
            {data[currentQuestion].type === 'multiple' ?
              <Grid>
                {options.map((option, i) =>
                  <Button 
                    className={classes.button} 
                    size='large' 
                    variant={ answer === i? 'contained' : 'outlined' }
                    onClick={() => choose(i)}
                    disabled={answered}
                  >
                    {decode(option)}
                  </Button>
                )}
              </Grid>
            :
              <Grid>
                <Radio
                  checked={answer === 'True'}
                  onChange={() => chooseBoolean('True')}
                  value="a"
                  name="radio-button-demo"
                  label="True"
                  disabled={answered}
                />
                True
                <Radio
                  checked={answer === 'False'}
                  onChange={() => chooseBoolean('False')}
                  value="a"
                  name="radio-button-demo"
                  label="False"
                  disabled={answered}
                />
                False
              </Grid>
            }
            {answered && 
              <Grid className={classes.result} >
                <Typography align='center' variant="h5">
                  {options[answer] === data[currentQuestion].correct_answer ?
                    'Correct'
                  :
                    'Sorry'
                  }
                </Typography>
                {currentQuestion < data.length - 1 &&
                  <Button className={classes.button} 
                    size='large' 
                    variant='outlined' 
                    onClick={() => next()}
                    >
                    Next Question
                  </Button>
                }
              </Grid>
            }
          </Grid>
          <Grid item className={classes.score}>
            <Score
              answered={currentQuestion + (answered?1:0)}
              correct={correctTotal}
              total={data.length}
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function decode(source){
  return decodeURI(source).replace(/%3F/, '?').replace(/%3A/, ':');
}

export default App

