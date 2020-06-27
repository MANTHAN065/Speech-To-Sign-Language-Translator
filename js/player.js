
console.log("file opened");

// list of puntutation marks for english language
englishpMarks = ["?", "!", "."];

// array to store finally what is to played
wordArray = new Array();
function FinalText(word, fileName)
{
	this.word = word;
	this.fileName = fileName;
}
var arrayCounter = 0;

// global variable to put lock on the animation 
// to avoid race condition
var playerAvailableToPlay = true;

/*	Check if this is sentence end for english language that is one of the
	puntuation marks then return true
*/
function isSentenceEndEnglish(letter)
{
	// if letter is any of the english puntuation mark then
	// return true else return false
	for(x = 0; x < englishpMarks.length; x++) {
		if(letter == englishpMarks[x])
			return true;
	}
	return false;
}

/*
	Check if current letter is space or not
*/
function isSpace(letter)
{
	// check if the letter is a space
	if(letter.charCodeAt(0).toString(16) == "20")
		return true;
	return false;
}

/*
	Function to take paragraph input by the user and tokenize it.
	Returns the words in an array
*/
function tokenizeEnglish(inText)
{
	flag = false; // flag will be set true if the inText text will end with pMarks
	len = inText.length; 
	
	// the input should end with a punctuation mark
	for(x = 0; x < englishpMarks.length; x++) {
		// check if last character of the sentence is pMarks or not
		if(inText[len - 1] == englishpMarks[x]) {
			flag = true;
			break;
		}
	}
	
	// if no puntuation in the end then put a puntuation mark in the sentence
	if(flag == false)
		inputText = inText + ".";
	else
		inputText = inText;
	
	// convert the given paragraph into sentences 
	// result is an array holding each sentence own its own

	result = inputText.match( /[^\.!\?]+[\.!\?]+/g );
	console.log("tokenize into sentences : " + result);
	
	// convert each sentence into words and also add the pause 
	// identifier to make the animation pause after each word
	
	// loop over the result array and replace space and end of sentence 
	// and store it newString
	newString="";
	for(y = 0; y < result.length; y++) {
		line = result[y];
		for(x = 0; x < line.length; x++) {
			if(isSpace(line[x]))
				newString = newString + ",";
			else 
				newString = newString + line[x];
		}

	}
	
	// create array of tokens
	console.log("Processed sting : " + newString);
	return newString;
}
