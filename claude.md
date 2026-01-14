Project Rules

TECHNICAL / STYLISTIC RULES

-Always use variables for any numerical values in any styling files. We want to cutdown on styling inconsistencies as best as possible so we should aim to create and use reusable variables when appropriate. Label every variable clearly.


PUZZLE GENERATION RULES

-Every cell answer must fall into either the category People, Places, or Things which can be:
	1. People: Celebrities (both online and traditional media), historical figures, athletes, artists, famous political figures, fictional characters (with some slight indication in the cell clue that the person in question is fictional)
	2. Places: Cities, US States, territories, nations, continents, oceans, famous landmarks (big ben, great wall of china, etc), iconic buildings, well-known deserts, bodies of water, mountains, volcanoes, other geographical features, and fictional locations such as Hogwarts or Narnia (with some slight indication in the cell clue that the location in question is fictional)
	3. Things: This is the most amorphous category as it could technically refer to any noun that is not a living being or place but I would like to avoid generic items such as "Stapler" or "microwave." Instead lets prioritize more esoteric objects such as specific tools, medical devices, food items, historical inventions, technology, iconic branded items (Jordan 1s, Kindle, etc), very specific products or items, and fictional items such as a lightsaber or Aladin's flying carpet (with some slight indication in the cell clue that the thing in question is fictional)

-Cell clues generally should be in the style of crossword clues which is to say playful, occasionally punny or jokey, culturally relevant when appropriate, occasionally indirect or esoteric or involves some type of misdirection. Rarely should clues be totally straightforward and in those situations this should be relegated exclusively to the second clue only.

-First clue each puzzle should generally be a little more ambiguous or esoteric or indirect than the second clue. this is not a 100% hard and fast rule but overall I want the first clue to be harder for the user to guess the answer from than the second clue. 

-To be clear the second clue should still attempt to be somewhat indirect or playful. Something like simply stating: "This city is the capital of X country" is not a quality enough clue.

-Avoid referencing the exact words in the answer within the cell clue text. For instance if the answer is "Piggy Bank" do not use the words "Pig" or "Bank" in the clue text

-For the 2 clues within each puzzle cell avoid writing clues based on the spelling of the words as these types of clues are relegated to the broader y-axis clue section or the "constraint" field in each puzzle in the json

-Y-axis clues (the constraints in the puzzle.json) should have to do with the spelling or linguistic construction of the answer. For example valid clues include but are not limited to the following list (Note that capital X denotes any variable letter or word in this list, not specifically the actual letter "X"): 	
	1. Starts with the letter X
	2. Ends with the letter X
	3. Contains X letter twice in a row
	4. Starts and ends with the same letter
	5. Word is palindrome
	6. Two words beginning with the same letter
	7. Two words ending in the same letter
	8. Three words beginning with the same letter
	9. Three words ending in the same letter
	10. Ends in “er” or similar
	11. Starts with “un” or similar
	12. Contains exactly X vowels per answer
	13. Contains obscure letter (q, x, z, etc) 
	14. Exactly one (two, three) word(s)
	15. Rhymes with X
	16. Contains a common noun
	17. Contains a color
	18. Contains an animal
	19. Not pronounced how it’s spelled
	20. Contains silent letters

	Other clues in this vein are also acceptable as long as the constraint applies to every answer in its respective block (for people, place, and thing).

-When you generate clues please crosscheck the answers with the constraints to ensure the answer actually satisfies the constraint as I have noticed several instances with auto-generated puzzles in which not all of the answers within a given constraint block actually satisfy the constraint condition

-For the People category specifically the constraints can apply to first or last names (Starts with X, ends with X, etc) unless specified otherwise. For instance a constraint such as "Two words beginning with the same letter" would imply that both first and last name will begin with same letter. However when generating clues try to avoid using Starts with X letter on very generic common names. For instance "starts with B" for Brad Pitt would not be a great clue. For more unique singular names or more esoteric letters like "Starts with L" for Lebron James works much better. For starts and ends with X clues try to use the more unique name of the individuals first and last names to satisfy the constraint. For instance "Starts with T" would be a better constraint for the name "Donald Trump" than "starts with D" as "Donald" is a very generic common name and does not immediatly invoke the image of the person in question as "Trump" does. 

-Feel free to reference online sources such as official crosswords from the New York Times or questions from Jeopardy and other quality trivia/crossword games and such for inspiration. 

-No duplicate answers anywhere. I.E. if the name Timothee Chalamet was used an answer in a puzzle it should not be an answer in any other puzzle in the json. 



