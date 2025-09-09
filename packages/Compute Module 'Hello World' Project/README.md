# Compute Module 'Hello World' Project

## Purpose  

This README provides an overview of the steps shown in *[Palantir's Compute Modules Pipelines: Hello World Tutorial.](https://www.youtube.com/watch?v=wCN9xqSDDLI&t=239s)* In this video, data in Foundry is transformed using an organization's custom local code.


The systems used are:
- a local Docker image (created in Visual Studio Code)
- Compute Module, Artifact, and Source files created in Palantir

## Steps

### 1. Set up the local Docker image
- Create a new compute module in Foundry using the execution mode of Pipelines. Go to the *Documentation* tab and then select *Build a compute module-backed pipeline* on the left
![alt text](images/Screenshot%202024-12-18%20at%203.10.42 PM.png)
- Create a local docker container. See the complete source code under the `app/` folder in this directory.
  - Follow steps 1-12 in the tab *Build a compute module-backed pipeline* except 
    - for input_info and output_info put identifiers "input" and "output" respectively if inputs and outputs are in Foundry
 
### 2. Set Up the Compute Module (Configuration tab)
- *Configure Container*: Build the local docker image, push the local docker to an artifact, and then select that docker for container 
- *Configure Sources*: Create a source that has an egress policy that accepts the Foundry URL, and enables exports
- *Configure Input and Output Streams*: Create two streams, input stream which just has column x, and output stream which has column twice_x. Choose api values "input" and "output" to match the work done in Step 1
- Container is now ready to run

## Potential Foundry Features to Enable Sharing and Collaboration

- Enable users to create a code repository that can be used as a docker image (*to complete Step 1 from this README*)
  - the terminal from this workspace should enable the user to build a Docker image and then push it to an Artifact (may already exist in Foundry)
