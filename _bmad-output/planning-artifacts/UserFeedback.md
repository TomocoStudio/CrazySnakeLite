Hi John, 
* Bugs:
    - Score should be at 0 by default, not 5. Still increase by 1 for each food.
    - Score display is on top of the canevas, this remove some visibility of the game play, the score must be placed outside the canevas. Ideally just above the canevas.

* Improvements:
 
    - Unify fonts and use Jersey_20 font for all texts in the game. Font already installed on this computer, but avalaible in the assets folder as well.
    - I really like the look of the phone call screen, take the grahic design and use the same for all menu screens.
    - No more fade or glow effect in the graphic design guidelines.
    - Display score above the canevas, the current score on the left (left-aligned) and the top score on the right (right-aligned). Use 2 colors, one for current score, a second for top score.
        -   Like this: Score: XXXX     Top score: XXXXX
    - Difficult to see the various food shapes, better to visualise all foods as a square, like the growing food. Keep food colours consistent with the effect on snake (invincibility, wall phase, speed increase, speed decrease, reverse controls).
    - Snake head is not enough visible, please add with 2 white eyes will be better. I can provide an image reference named "SnakeHeadv2.png" in the project root. And the border color for the snake should be the same as the grid background color.
    - Users are lost with the way to remove the phone call screen, please add text “Presse space bar or click on End” for the phone call screen, but in small size.
    - Snake death need a accoustic signal with a dedicated sound to play when the snake die. We should add that. File name "snake-die.mp3".
    - Title should be "Crazy Snake" instead of "CrazySankeLite".
    - Current names for phone calls are not hilarous, please remove then and replace it by:
        - Al Gorithm
        - Meg A. Byte
        - Ali Sing
        - Anna Log
        - Ray Tracing
        - Pat Ch-Notes
        - Mac Address
        - Artie Ficial
        - Floppy Phil
        - Dot Matrix
        - Gia Hertz
        - Terry Byte
        - Perry Pheral
        - Cade Ridger
        - Mona Tor
        - Syd Ram
        - Bessie IOS
        - Dee Frag
        - Buffy Ring
        - DJ Snake
        - GAME OVER
