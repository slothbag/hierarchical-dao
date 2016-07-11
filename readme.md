Hierarchical DAO
=================

The **'Hierarchical DAO'** is a smart contract for managing funds and organisational structure in a decentralized manner.

Each deployed instance of the smart contract can be chained to a parent or child DAO to create any organisational structure desirable.

All actions are first initiated with a **Proposal** which is voted on by all members of the DAO or auto-approved based on custom variables, once approved the proposal can be executed.

Once DAO's are chained it is possible for a member of a child DAO to ripple their proposal all the way up the DAO hierarchy to the highest group and as long as no one has **Veto'd** it on its way up the original submitter can execute that proposal at the top level.

When would this be useful? Imagine a complex DAO hierarchy consisting of dozens of child DAOs and hundreds of members where the higher up levels have lost interest or are unable to participate due to loss of keys or ill health, an enthusiastic participant at the lowest level can enact change right from the top.

This gives the DAO the ability to route around damage and poor performing contributors.

## Features
* Zero configuration, just deploy the DAO contract and start adding users
* Minimal deployment cost, the DAO instance is very small, about 400k gas to deploy
* Unlimited scalability, chain DAOs together to construct a hierarchy as small or large as you like
* Members at every level including the lowest can ripple proposals up the hierarchy to any parent level

## Status
There are still a few methods not implemented. This is released purely as a proof of concept and for public auditing of the principal functionality and for security.

It is currently not taking into account "stake" or "shares" for each member, it simply assumes each member gets one vote.  I may add stake at some point if it makes sense.

## Future of DAOs
We believe DAOs can be used for a wide range of things not just for VC funding, hopefully this style of DAO can be used to create some interesting new concepts.

We have learnt a lot from the recent issues with 'TheDAO', and are excited to continue pushing the boundaries of what we can achieve with Decentralized Autonomous Organisations.