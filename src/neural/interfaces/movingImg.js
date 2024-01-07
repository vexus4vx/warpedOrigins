// this is just a random idea - not sure about how when or where this could be usefull

/*
use the alpha channel to denote solid edges

so 1 pixel has 4 adjoining pixels so use 4 bits to define weather or not they are connected
we could use the remaining 4b do give a strength value to each of the connections where 0 means can be broken / soft and 1 means immobile / unbreakable

if we then apply a trigger to the image and maybe a handfull of physics rules - ??
we should be able to deform the image fairly cost efficiently ...

if we then manage to merge 2 images so that we can drop 1 charakter into another image - then we have something novel ... - or plain weird / scary


... lets call it living alphas ??

combining the images in canvas is simple we just need to apply the height and width so that one starts where the other ends
the rules should be kinda like 
1: some representation of gravity
2: rules so things can't phase through each other
3: depth by layering a non existant extra layer behind the first allowing things in an image to move in front of others
4: depth ... magnification, .... - can we play with different aspect ratios or pixel sizes ? - eg in the layered frame
*/