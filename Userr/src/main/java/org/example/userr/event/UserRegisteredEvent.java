package org.example.userr.event;

import org.example.userr.entity.UserCredential;
import org.springframework.context.ApplicationEvent;

public class UserRegisteredEvent extends ApplicationEvent {
    private final UserCredential user;

    public UserRegisteredEvent(Object source, UserCredential user) {
        super(source);
        this.user = user;
    }

    public UserCredential getUser() {
        return user;
    }
}