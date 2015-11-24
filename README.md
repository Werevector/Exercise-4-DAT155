[![Stories in Ready](https://badge.waffle.io/Werevector/Exercise-4-DAT155.png?label=ready&title=Ready)](https://waffle.io/Werevector/Exercise-4-DAT155)
# Exercise-4-DAT155

Plans for development
---------------------
Hosted project: https://werevector.github.io/Exercise-4-DAT155/  
The general idea is to create a 3d scene with an isometrical view, like those found in rpgs etc.  
The scene is going to have terrain, with lighting and scenery.  
A character should be displayed, with the ability to move around in the scene.  

Showing off certain shading effects is going to be vital for the project.  
We are going to want some sort of day-night cycle, to show of the global lighting.  
Torches and other lights are going to cast off light to the area around it.  
This is the bare minimum, other effects can be added to the project later.

**Some ideas for scenery**
* A small village with torches and lights
* Trees and stones, normal terrain details
* Villagers standing around

**Technical details**
--------------------
* A Pick function should be used for targeting an area on the ground, that can be used to *"click"* on objects.  
* We should have some sort of model loader, that loads the objects used in the world, so that we can edit them  
  in some model editor.
* Some world editor would be useful, but this is next to impossible for us to make right now,  
  therefore try to keep track of the position of major objects, maby in some file etc.

**Rules surrounding code**
--------------------------
Considering we are a small team, we will need a few rules regarding how we develop this.  
Every member will have his own branch available for development, and sub-branches can be made, but has to be  
named according to the parent branch.  
**Ex:**  
werevector <- user development  
werevector-animtest <- branch for testing animations by user.  

Try to keep objects and functions as tidy as possible, give good names, and structure it properly.  
Use prototype to relate functions to certain *"objects"*, dont define one function with a load of functions inside.  

Commits are supposed to be informative, write a small compressed message about what you have done, nothing else.



