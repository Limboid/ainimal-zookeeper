# **AI**nimal :tiger: Zookeeper

**I think the server is useless. Just make a client and utilities to make a graphQL api about tensorflow and pytorch models. Implement auth on a per-project (not via ainimal) basis**

**THIS IS AN IDEA-IN-PROGRESS.**

A client and server to facilitate observing, interacting with, and managing AI systems in the wild.

As heterogeneous, distributed, and exoitc AI systems (**AI**nimals :tiger:) continue to pervade the real world, it is incrinsingly important to observe, care for, and stay in touch with them. **AI**nimal :tiger: Zookeeper provides a client and server to facilitate this interaction with the following features:

- a cross-platform (iOS, Android, web, desktop) react-native/flutter client which allows users to:

- launch, pause, and terminate model instances; save and restore from checkpoints

- change running state of launched models (training, inference, both, none) 

- view saved model architecture, parameters, and attributes

- observe, override, record, and replaying input modalities, output modalities, activations, and weights

- federate user access to the above features

## Key Principles

- Design flow: server.js --> graphQL schema --> client 

- Instead of using a config file, custom API routes, and middleware, the entire server is defined in high-level nodejs objects and functions. The server instance is exposed to the client via a graphQL API for direct query (alothough most variables are hidden from unauthorized users). To get the server running for a new use-case, all you have to do is change the high-level server code (also the secrets). The server file looks like this:
```javascript
// server/main.js
server = Server({
  port: 3000,
  authentication_providers: [
    BasicAuthenticationProvider({
      database: Database | path_to_json_file,
      secret: process.env.JWT_SECRET,
    }),
    GoogleAuthenticationProvider({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    }),
    ...
  ],
  authorization_provider: 
    ...  // determines who can see, edit, delete, etc. what
  ,
  model_providers: [
    LocalModelProvider({
      root: path_to_models,
    }),
    GithubModelProvider({
      token: process.env.GITHUB_TOKEN,
    }),
    ...
  ],
  environments: [
    AInimalEnvironment({
      path: path_to_python_env,
      class_name: "MyModel"
      max_instances: 10,
    }),
    AInimalEnvironment.from_dmenv({ // or from_gym_env, from_keras_env, from_tfagents_env, TODO
      path: path_to_python_env,
      class_name: "MyModel"
      max_instances: 10,
    })  // the server has good inference for gym.Env, dm_env.Env and a few other standard environment types.
  ],
  compute_nodes: [ // anything that can provide nodes for `launchpad`, `tf`, `torch`, `jax`, or other frameworks to run on
    Local(['CPU:1', 'CPU:2', 'CPU:3', 'GPU:0']),
    ...  // GCP AWS etc. server provisioners
  ],
});

// you might also package other process invokations into the server if your working on something small
process.start(`jupyter lab --ip '*' --port 8081 --no-browser --allow-root --NotebookApp.token=''`);
process.start(`tensorboard ...`);
process.start(`wandb serve ...`);  // this command may not exist
process.start(`python3 -m http.server 8082`);
process.start(`python3 limboid_ros.py --port ${process.env.ROS_PORT}`);

server.listen(process.env.PORT || 3000);
```

- Checkpoints are tags in the git graph for a given model. Only some VC providers allow you to view ALL repositories unqualified. Most VC providers let you view by account or by search.

- The server manages running models but they have to be in python and the act, train, input_spec/modality, and output_spec/modality must be defined. The server tries to infer these from the model code and its associated `AInimalAgent.from_pyfunc/tf_func/keras_model/ptorch_module/TODO` functions, but you can be maximally explicit by directly subclassing the `AInimal` class. If you want the client to enter parameters when launching a model, include a static attribute named `AINIMAL_PARAMETERS` of the type `list[dict[str,any]]` (or similar typing for js or c++) in the model class. This only works for python, javascript, and c++ class models -- not saved model file formats. It should look something like:

```python
class MyModel(AInimal.Agent):
  AINIMAL_PARAMETERS = [
    {
      "name": "learning_rate",
      "type": "float",
      "default": 0.001,
      "description": "The learning rate for the optimizer."
    },
    {
      "name": "batch_size",
      "type": "int",
      "default": 32,
      "description": "The batch size for the model."
    }
  ]

  def __init__(self, learning_rate, batch_size):
    ...
  
  def forward(self, inputs: dict) -> dict:
    ...

  def train(self, traj: list[timestep]) -> 'b':
    ...

  def save(self, path: str) -> None:
    # quick solution: pickle.dump(self, open(path, 'wb'))
    ...

  def load(self, path: str) -> None:
    # quick solution: self = pickle.load(open(path, 'rb'))
    ...

  @property
  def input_modalities(self) -> dict:
    ...

  @property
  def output_modalities(self) -> dict:
    ...

  @property
  def state(self) -> dict:
    ...
```

- Environments are defined in a similar way. They can be loaded from common third-party frameworks too. (See `AInimal.Environment`)

- Zookeeper selects a **driver** implementation that best fits the model and environment languages. If both are written in python, the python driver is used. If both are written in javascript, the javascript driver is used. If both are written in c++, the c++ driver is used. If the language is mixed, the python driver is used. (Only pure python is currently supported). The driver exposes a graphQL API for interfacing with the model and environment. This endpoint is chained into the server's graphQL schema.

- The client provides a a minimally complex, user-friendly interface to the AI models and environments running on the server. 
  - Example: If the server does not offer the client the ability to create environments or launch models, those pages are not shown.
  - Example: If the user is an operator, the client can see the model repositories and can launch models.
  - Example: If the user is an observer, the client can only view the model.
  - Example: If the modalitiy are not defined, the client only recieves a tensor representation of the state.
  - Example: If the `train` function is not defined on an agent, the operator does not observe a corresponding button.

## Client

The client provides a cross platform interface for interacting with one or more Zookeeper servers. You can access the client in several ways:

- Launch the server with the flag `--client` and then navigate to the url that is printed in your local browser or on another device in the same LAN. (This method automatically passes server connection information to the client, so it's faster for local development.)

- From the command line, enter: `python3 -m ainimal_zookeeper.client`. Then navigate to the url that is printed in your local browser or on another device in the same LAN.

- Install `Animal Zookeeper` from the .apk, .ipa, .exe, or .appimage files located under `client/*`. In the future, you will also be able to download the mobile apps directly from the App Store or Play Store.

- (Coming soon:) Visit `https://computatrum.io/ainimal_zookeeper` in your browser.

Next connect to a running AInimal Zookeeper server by entering the `server_url` and `server_port`. You may be prompted for a username and password.

## Production Use Cases

- computatrum.io lets you run, interact with, reinforce online, fine-tune, and distribute (with optional payment) computatrum multi-agent-network models. It will be like a web service except instead of servers, you launch computatra that have been trained for 3d animation, programming, research, and other tasks as well as base-models. 

- limboid and teleboid robots might get away with only an Android app and distributed microprocessors, but they can still expose a similar graphQL endpoint to allow re-using the client. (I don't see why you'd even need the server for this since models can't be launched on the fly anyway and they are distributed between the Android and cloud.) The client could connect to an Android-local server for lower network requirements or the cloud server for global access.


## Notes

- The server design feels restrictive. However I can consider it as a good starting point for computatrum.io at least. 